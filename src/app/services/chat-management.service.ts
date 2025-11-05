import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ServiceProxy, ChatMessageHistoryDto, ChatMessage } from './api-client';
import { ToastService } from './toast.service';

export interface ChatSession {
  sessionId: string;
  lastActivity: Date;
  messageCount: number;
  lastMessage: string;
  isSelected?: boolean;
}

export interface ChatExportData {
  exportDate: Date;
  sessions: {
    sessionId: string;
    messages: ChatMessage[];
    metadata: {
      messageCount: number;
      firstMessage?: Date;
      lastMessage?: Date;
    };
  }[];
  userInfo: {
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatManagementService {
  private selectedSessions: Set<string> = new Set();

  constructor(
    private serviceProxy: ServiceProxy,
    private toastService: ToastService
  ) { }

  /**
   * Get all chat sessions for the current user
   */
  getUserChatSessions(): Observable<ChatSession[]> {
    return this.serviceProxy.userChatHistory().pipe(
      map((history: ChatMessageHistoryDto[]) => {
        return history.map(session => ({
          sessionId: session.sessionId || '',
          lastActivity: session.lastActivity || new Date(),
          messageCount: session.messageCount || 0,
          lastMessage: session.lastMessage || '',
          isSelected: this.selectedSessions.has(session.sessionId || '')
        }));
      }),
      catchError((error) => {
        console.error('Error fetching chat sessions:', error);
        this.toastService.error('Failed to load chat sessions', 'Error');
        return of([]);
      })
    );
  }

  /**
   * Get messages for a specific session
   */
  getSessionMessages(sessionId: string): Observable<ChatMessage[]> {
    return this.serviceProxy.history(sessionId).pipe(
      catchError((error) => {
        console.error('Error fetching session messages:', error);
        this.toastService.error('Failed to load session messages', 'Error');
        return of([]);
      })
    );
  }

  /**
   * Delete a specific chat session
   */
  deleteSession(sessionId: string): Observable<void> {
    return this.serviceProxy.session(sessionId).pipe(
      map(() => {
        this.selectedSessions.delete(sessionId);
        this.toastService.success('Chat session deleted successfully', 'Success');
      }),
      catchError((error) => {
        console.error('Error deleting session:', error);
        this.toastService.error('Failed to delete chat session', 'Error');
        return of(undefined);
      })
    );
  }

  /**
   * Delete multiple chat sessions
   */
  deleteMultipleSessions(sessionIds: string[]): Observable<void> {
    const deletePromises = sessionIds.map(id =>
      this.deleteSession(id).toPromise()
    );

    return new Observable(observer => {
      Promise.all(deletePromises)
        .then(() => {
          sessionIds.forEach(id => this.selectedSessions.delete(id));
          this.toastService.success(`${sessionIds.length} chat sessions deleted`, 'Success');
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error deleting multiple sessions:', error);
          this.toastService.error('Failed to delete some sessions', 'Error');
          observer.error(error);
        });
    });
  }

  /**
   * Toggle session selection for bulk operations
   */
  toggleSessionSelection(sessionId: string): void {
    if (this.selectedSessions.has(sessionId)) {
      this.selectedSessions.delete(sessionId);
    } else {
      this.selectedSessions.add(sessionId);
    }
  }

  /**
   * Select all sessions
   */
  selectAllSessions(sessions: ChatSession[]): void {
    sessions.forEach(session => {
      this.selectedSessions.add(session.sessionId);
    });
  }

  /**
   * Clear all selections
   */
  clearSelections(): void {
    this.selectedSessions.clear();
  }

  /**
   * Get selected session IDs
   */
  getSelectedSessions(): string[] {
    return Array.from(this.selectedSessions);
  }

  /**
   * Export chat sessions to JSON
   */
  async exportSessions(sessionIds: string[], userInfo: { email: string; name: string }): Promise<void> {
    try {
      const exportData: ChatExportData = {
        exportDate: new Date(),
        sessions: [],
        userInfo
      };

      for (const sessionId of sessionIds) {
        const messages = await this.getSessionMessages(sessionId).toPromise();
        if (messages && messages.length > 0) {
          const sortedMessages = messages.sort((a, b) =>
            (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
          );

          exportData.sessions.push({
            sessionId,
            messages: sortedMessages,
            metadata: {
              messageCount: messages.length,
              firstMessage: sortedMessages[0]?.createdAt,
              lastMessage: sortedMessages[sortedMessages.length - 1]?.createdAt
            }
          });
        }
      }

      // Create and download JSON file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.toastService.success('Chat sessions exported successfully', 'Export Complete');
    } catch (error) {
      console.error('Error exporting sessions:', error);
      this.toastService.error('Failed to export chat sessions', 'Export Error');
    }
  }

  /**
   * Search through chat sessions
   */
  searchSessions(sessions: ChatSession[], searchTerm: string): ChatSession[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return sessions;
    }

    const term = searchTerm.toLowerCase();
    return sessions.filter(session =>
      session.sessionId.toLowerCase().includes(term) ||
      session.lastMessage.toLowerCase().includes(term)
    );
  }

  /**
   * Sort sessions by different criteria
   */
  sortSessions(sessions: ChatSession[], sortBy: 'date' | 'messages' | 'id'): ChatSession[] {
    const sorted = [...sessions];

    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) =>
          b.lastActivity.getTime() - a.lastActivity.getTime()
        );
      case 'messages':
        return sorted.sort((a, b) => b.messageCount - a.messageCount);
      case 'id':
        return sorted.sort((a, b) => a.sessionId.localeCompare(b.sessionId));
      default:
        return sorted;
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessions: ChatSession[]): {
    totalSessions: number;
    totalMessages: number;
    averageMessages: number;
    oldestSession?: Date;
    newestSession?: Date;
  } {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalMessages: 0,
        averageMessages: 0
      };
    }

    const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0);
    const dates = sessions.map(s => s.lastActivity).sort((a, b) => a.getTime() - b.getTime());

    return {
      totalSessions: sessions.length,
      totalMessages,
      averageMessages: Math.round(totalMessages / sessions.length),
      oldestSession: dates[0],
      newestSession: dates[dates.length - 1]
    };
  }
}
