import { AnalyticsService } from 'src/app/services/analytics.service';
import { ChatApiService } from './../../services/chat-api.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Gavel,
  Menu,
  Scale,
  Shield,
  Users,
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ChatMessageComponent } from 'src/app/shared/chats-components/chat-message/chat-message.component';
import { SidebarV2Component } from 'src/app/shared/chats-components/sidebar-v2/sidebar-v2.component';
import { ChatInputComponent } from 'src/app/shared/chats-components/chat-input/chat-input.component';
import { MessageWindowComponent } from 'src/app/shared/message-window/message-window.component';
import { UserMenuComponent } from 'src/app/shared/chats-components/user-menu/user-menu.component';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { ChatMessage, ServiceProxy } from 'src/app/services/api-client';
import { TypingIndicatorComponent } from 'src/app/shared/chats-components/typing-indicator/typing-indicator.component';

interface ConstitutionalDocument {
  id: string;
  name: string;
  description: string;
}

interface LegalSuggestion {
  id: string;
  title: string;
  description: string;
  icon: any;
  prompt: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    SidebarV2Component,
    ChatInputComponent,
    LucideAngularModule,
    SidebarV2Component,
    MessageWindowComponent,
    UserMenuComponent,
    TypingIndicatorComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  //messages: ChatMessage[] = []
  isLoading = false;
  isSidebarOpen = false;
  showUserMenu = false;

  @ViewChild(SidebarV2Component) sidebarComponent!: SidebarV2Component;

  // Icons
  menuIcon = Menu;
  readonly ChevronDown = ChevronDown;
  readonly Scale = Scale;
  readonly FileText = FileText;
  readonly Users = Users;
  readonly Shield = Shield;
  readonly Gavel = Gavel;
  readonly BookOpen = BookOpen;

  isDropdownOpen = false;
  selectedDocument: ConstitutionalDocument | null = null;

  constitutionalDocuments: ConstitutionalDocument[] = [
    {
      id: '1',
      name: '1992 Constitution',
      description: 'The supreme law of Ghana.',
    },
    {
      id: '2',
      name: 'Labour Act, 2003',
      description: 'Consolidates laws on employment and labour rights.',
    },
    {
      id: '3',
      name: 'Intestate Succession Law, 1985 (PNDCL 111)',
      description: 'Governs inheritance when a person dies without a will.',
    },
    {
      id: '4',
      name: 'Right to Information Act, 2019',
      description:
        'Gives citizens access to information held by public institutions',
    },
  ];

  legalSuggestions: LegalSuggestion[] = [
    {
      id: '1',
      title: 'Contract Review',
      description:
        'Analyze contracts and legal documents for key terms and potential issues',
      icon: this.FileText,
      prompt:
        'I need help reviewing a contract. Can you guide me through the key terms I should look for?',
    },
    {
      id: '2',
      title: 'Constitutional Rights',
      description:
        'Understand your constitutional rights and legal protections',
      icon: this.Scale,
      prompt: 'Can you explain my constitutional rights in this situation?',
    },
    {
      id: '3',
      title: 'Legal Research',
      description: 'Research case law, statutes, and legal precedents',
      icon: this.BookOpen,
      prompt:
        'I need help researching legal precedents for my case. Where should I start?',
    },
    {
      id: '4',
      title: 'Civil Rights',
      description:
        'Learn about civil rights protections and discrimination laws',
      icon: this.Users,
      prompt: 'What are my civil rights protections under federal law?',
    },
    {
      id: '5',
      title: 'Legal Procedures',
      description: 'Navigate court procedures and legal processes',
      icon: this.Gavel,
      prompt: 'Can you walk me through the legal process for filing a lawsuit?',
    },
    {
      id: '6',
      title: 'Privacy Rights',
      description: 'Understand privacy laws and data protection rights',
      icon: this.Shield,
      prompt: 'What are my privacy rights regarding personal data collection?',
    },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  messages: ChatMessage[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private chatApiService: ChatApiService,
    private apiServiceProxy: ServiceProxy,
    public analyticsService: AnalyticsService
  ) {
    this.selectedDocument = this.constitutionalDocuments[0];
    this.showUserMenu = this.authService.isAuthenticated();
  }

  onSendMessage(message: string): void {
    this.analyticsService.trackEvent('send_message', 'User sent a message', 'engagement');

    const userMessage = new ChatMessage();
    userMessage.id = Date.now();
    userMessage.message = message;
    userMessage.isFromUser = true;
    userMessage.createdAt = new Date();

    this.messages.push(userMessage);

    this.isLoading = true;
    console.log('Sending message via API:', message);

    let sessionId= undefined;
    if(this.messages.length > 0){
      sessionId = this.messages[0].sessionId;
    }

    this.chatApiService.sendMessage(message, undefined, sessionId).subscribe({
      next: (response) => {
        const botMessage = new ChatMessage();

        botMessage.id = Number.parseInt(String(response.id)) || Date.now() + 1;
        botMessage.response = response.message
          ? response.message
          : 'No response';
        botMessage.isFromUser = false;
        botMessage.createdAt = response.createdAt
          ? new Date(response.createdAt)
          : new Date();

        this.messages.push(botMessage);
        this.isLoading = false;

        if (this.sidebarComponent) {
          this.sidebarComponent.refreshChatHistory();
        }

        // if (this.messages.filter((m) => m.isFromUser === false).length === 1) {
        //   this.toastService.success("Connected to NsemBot! Ask me anything about legal matters.")
        // }
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.isLoading = false;

        const errorMessage = new ChatMessage();
        errorMessage.id = Date.now() + 1;
        errorMessage.response =
          "Sorry, I'm having trouble responding right now. Please try again.";
        errorMessage.isFromUser = false;
        errorMessage.createdAt = new Date();
        this.messages.push(errorMessage);
      },
    });

    /*
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.messages.push(newMessage);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Thanks for your message! How can I help you further?',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      this.messages.push(aiResponse);
    }, 1000);
    */
  }

  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  openSettings() {
    console.log('Opening settings...');
  }

  openProfile() {
    console.log('Opening profile...');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectDocument(document: ConstitutionalDocument): void {
    this.selectedDocument = document;
    this.isDropdownOpen = false;
  }

  onSuggestionClick(suggestion: LegalSuggestion): void {
    this.onSendMessage(suggestion.prompt);
  }

  public onNewChat(): void {
    this.messages = [];
    this.selectedDocument = this.constitutionalDocuments[0];
    // this.toastService.success("Started new chat session");
  }

  loadChatSession(sessionId: string): void {
    this.isLoading = true;
    this.apiServiceProxy.history(sessionId).subscribe({
      next: (history) => {
        this.messages = history;
        this.isLoading = false;
        // this.toastService.success("Chat session loaded")
        console.log(
          ' Loaded chat session:',
          sessionId,
          'with',
          this.messages.length,
          'messages'
        );
      },
      error: (error) => {
        console.error(' Error loading chat session:', error);
        this.isLoading = false;
        this.toastService.error('Failed to load chat session');
      },
    });
  }
}
