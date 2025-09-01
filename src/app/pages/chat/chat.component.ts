import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BookOpen, ChevronDown, FileText, Gavel, Menu, Scale, Shield, Users } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ChatMessage, Message } from 'src/app/core/models/Message';
import { ChatMessageComponent } from 'src/app/shared/chats-components/chat-message/chat-message.component';
import { SidebarV2Component } from 'src/app/shared/chats-components/sidebar-v2/sidebar-v2.component';
import { ChatInputComponent } from 'src/app/shared/chats-components/chat-input/chat-input.component';
import { MessageWindowComponent } from 'src/app/shared/message-window/message-window.component';

interface ConstitutionalDocument {
  id: string;
  name: string;
  description: string;
}


interface LegalSuggestion {
  id: string
  title: string
  description: string
  icon: any
  prompt: string
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
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  //messages: ChatMessage[] = []
  isLoading = false;
  isSidebarOpen = false;

  // Icons
  menuIcon = Menu;
  readonly ChevronDown = ChevronDown;
  readonly Scale = Scale
  readonly FileText = FileText
  readonly Users = Users
  readonly Shield = Shield
  readonly Gavel = Gavel
  readonly BookOpen = BookOpen

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
      id: "1",
      title: "Contract Review",
      description: "Analyze contracts and legal documents for key terms and potential issues",
      icon: this.FileText,
      prompt: "I need help reviewing a contract. Can you guide me through the key terms I should look for?",
    },
    {
      id: "2",
      title: "Constitutional Rights",
      description: "Understand your constitutional rights and legal protections",
      icon: this.Scale,
      prompt: "Can you explain my constitutional rights in this situation?",
    },
    {
      id: "3",
      title: "Legal Research",
      description: "Research case law, statutes, and legal precedents",
      icon: this.BookOpen,
      prompt: "I need help researching legal precedents for my case. Where should I start?",
    },
    {
      id: "4",
      title: "Civil Rights",
      description: "Learn about civil rights protections and discrimination laws",
      icon: this.Users,
      prompt: "What are my civil rights protections under federal law?",
    },
    {
      id: "5",
      title: "Legal Procedures",
      description: "Navigate court procedures and legal processes",
      icon: this.Gavel,
      prompt: "Can you walk me through the legal process for filing a lawsuit?",
    },
    {
      id: "6",
      title: "Privacy Rights",
      description: "Understand privacy laws and data protection rights",
      icon: this.Shield,
      prompt: "What are my privacy rights regarding personal data collection?",
    },
  ]

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  messages: Message[] = [];

  constructor(){
    this.selectedDocument = this.constitutionalDocuments[0];
  }

  onSendMessage(content: string) {
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
    this.onSendMessage(suggestion.prompt)
  }
}
