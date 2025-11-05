import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LucideAngularModule, X, HelpCircle, Book, MessageSquare, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-help-support-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './help-support-modal.component.html',
  styleUrl: './help-support-modal.component.css'
})
export class HelpSupportModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  // Icons
  closeIcon = X;
  helpIcon = HelpCircle;
  bookIcon = Book;
  messageIcon = MessageSquare;
  alertIcon = AlertTriangle;

  // FAQ state
  activeFaqIndex: number | null = null;

  // FAQ data
  faqs = [
    {
      question: "How do I start a new conversation?",
      answer: "Click the 'New Chat' button in the sidebar or use the keyboard shortcut Ctrl+N (Cmd+N on Mac) to start a new conversation."
    },
    {
      question: "Can I save my conversations?",
      answer: "Yes, all your conversations are automatically saved to your account. You can access them anytime from the sidebar."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All conversations are encrypted and stored securely. We never share your personal information with third parties."
    },
    {
      question: "How do I change my settings?",
      answer: "Click on your profile picture in the top-right corner and select 'Settings' to access your account preferences."
    },
    {
      question: "Can I export my conversations?",
      answer: "Currently, you can view and manage your conversations within the app. Export functionality is coming soon."
    }
  ];

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    this.onClose();
  }
}
