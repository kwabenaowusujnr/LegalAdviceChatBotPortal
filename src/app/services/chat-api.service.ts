import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthResponse, ChatMessage, ServiceProxy, ChatMessageHistoryDto, ChatMessageInputDto } from './api-client';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private currentSessionId: string | null = null

  constructor(
    private serviceProxy: ServiceProxy,
    private toastService: ToastService
  ) {
    this.initializeSession();
  }

  private initializeSession(): void {
    this.currentSessionId = this.generateSessionId()
    console.log("[v0] Initialized chat session:", this.currentSessionId)
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  startNewSession(): void {
    this.currentSessionId = this.generateSessionId()
    console.log("[v0] Started new chat session:", this.currentSessionId)
  }

  getChatHistory(): Observable<ChatMessageHistoryDto[]> {
    if (!this.currentSessionId) {
      return of([])
    }

    return this.serviceProxy.history(this.currentSessionId).pipe(
      map((apiMessages: ChatMessageHistoryDto[]) => {
        console.log("[v0] Fetched chat history:", apiMessages);
        return apiMessages;
      }),
      catchError((error) => {
        console.error("[v0] Error getting chat history:", error)
        this.toastService.error("Failed to load chat history.")
        return of([])
      }),
    )
  }


  public sendMessage(message: string, documentContext?: string): Observable<ChatMessage> {
    if (!this.currentSessionId) {
      this.initializeSession()
    }

    const chatInput = new ChatMessageInputDto();
    chatInput.sessionId = this.currentSessionId!;
    chatInput.message = message;
    chatInput.documentContext = documentContext;


    console.log("[v0] Sending chat message:", chatInput);

    return this.serviceProxy.sendMessage(chatInput).pipe(
      switchMap(() => this.getLatestBotResponse()),
      catchError((error) => {
        console.error("[v0] Error sending message:", error)
        this.toastService.error("Failed to send message. Please try again.")

        const chatMsg = new ChatMessage();
        chatMsg.message = "Sorry, I'm having trouble responding right now. Please try again.";
        chatMsg.createdAt = new Date();
        return of(chatMsg);
      }),
    )
  }

  private getLatestBotResponse(): Observable<ChatMessage> {
    if (!this.currentSessionId) {
      throw new Error("No active session")
    }


    return this.serviceProxy.history(this.currentSessionId).pipe(
      map((response: ChatMessage[]) => {

        const botMessages = response.filter((m) => !m.isFromUser)
        const latestBotMessage = botMessages[botMessages.length - 1]

        if (latestBotMessage && latestBotMessage.response) {
          const chatMsg = new ChatMessage();
          chatMsg.message = latestBotMessage.response;
          chatMsg.id = latestBotMessage.id || 0;
          chatMsg.createdAt = latestBotMessage.createdAt || new Date();

          return chatMsg;
        } else {
          const chatMsg = new ChatMessage();
          chatMsg.message = "I received your message. How can I help you further?";
          chatMsg.createdAt = new Date();

          return chatMsg;
        }

      }),
      catchError((error) => {
        const chatMsg = new ChatMessage();
        chatMsg.message = "Sorry, I'm having trouble responding right now. Please try again.";
        chatMsg.id = 0;
        chatMsg.createdAt = new Date();
        chatMsg.init?.();
        return of(chatMsg);
      })
    );
  }


}
