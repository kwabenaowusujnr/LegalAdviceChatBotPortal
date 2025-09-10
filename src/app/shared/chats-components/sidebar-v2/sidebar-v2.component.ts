import { AnalyticsService } from 'src/app/services/analytics.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Menu,
  Plus,
  MessageSquare,
  Book,
  Compass,
  Settings,
  ChevronDown,
  X,
} from 'lucide-angular';
import { NavigationSection } from 'src/app/core/models/Message';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api/api.service';
import {
  ChatMessageHistoryDto,
  ServiceProxy,
} from 'src/app/services/api-client';

@Component({
  selector: 'app-sidebar-v2',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.css'],
})
export class SidebarV2Component {
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() newChat = new EventEmitter<void>();
  @Output() loadChatSession = new EventEmitter<string>();

  isExpanded = true;

  isLoadingHistory = false;
  chatMessageHistory: ChatMessageHistoryDto[] = [];

  // Icons
  menuIcon = Menu;
  plusIcon = Plus;
  messageIcon = MessageSquare;
  bookIcon = Book;
  compassIcon = Compass;
  settingsIcon = Settings;
  chevronIcon = ChevronDown;
  closeIcon = X;

  constructor(
    private router: Router,
    public authService: AuthService,
    private apiService: ServiceProxy,
    private analyticsService: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.loadChatHistory()
      }
    })
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  toggleSection(section: NavigationSection): void {
    if (section.isCollapsible) {
      section.isExpanded = !section.isExpanded;
      this.isExpanded = !this.isExpanded;
    }
  }

  private loadChatHistory(): void {
    if(!this.authService.isAuthenticated()){
      return;
    }

    this.isLoadingHistory = true;
    this.chatMessageHistory = [];

    this.apiService.userChatHistory().subscribe({
      next: (chatHistory: ChatMessageHistoryDto[]) => {
        this.chatMessageHistory = chatHistory;

        this.isLoadingHistory = false;
      },
      error: (error) => {
        console.error('Failed to load chat history:', error);
        this.isLoadingHistory = false;
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSidebar.emit(); // Close sidebar on mobile after navigation
  }

  onNewChat(): void {
    this.analyticsService.trackEvent('new_chat', 'User started a new chat', 'engagement');
    this.newChat.emit();
    this.closeSidebar.emit(); // Close sidebar on mobile after navigation
  }

  private formatChatTitle(lastMessage: string): string {
    const maxLength = 30;
    const cleanMessage = lastMessage.replace(/[#*-]/g, '').trim();
    return cleanMessage.length > maxLength
      ? cleanMessage.substring(0, maxLength) + '...'
      : cleanMessage;
  }

  onChatItemClick(item: ChatMessageHistoryDto): void {
    this.loadChatSession.emit(item.sessionId);
    this.closeSidebar.emit();
  }

  public refreshChatHistory(): void {
    if (this.authService.isAuthenticated$) {
      this.loadChatHistory()
    }
  }
}
