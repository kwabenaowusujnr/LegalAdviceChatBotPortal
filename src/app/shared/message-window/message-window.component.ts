import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../../core/models/Message';
import { CommonModule } from '@angular/common';
import { ChatMessage } from 'src/app/services/api-client';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-message-window',
  imports: [CommonModule],
  templateUrl: './message-window.component.html',
  styleUrl: './message-window.component.css'
})
export class MessageWindowComponent {
  @Input() message!: ChatMessage
  @Input() currentLanguage: string = 'en'
  @Output() feedbackSelected = new EventEmitter<{ messageId: string; feedback: "good" | "bad" | "custom" }>()

  // Track translation state
  isTranslating = false;
  showingEnglish = false;
  englishTranslation = '';

  constructor(private translationService: TranslationService) {}


  onFeedback(feedback: "good" | "bad" | "custom") {
    this.feedbackSelected.emit({
      messageId: this.message.id?.toString() || '',
      feedback,
    })
  }

  /**
   * Check if translate button should be shown
   */
  shouldShowTranslateButton(): boolean {
    return !this.message.isFromUser && this.currentLanguage !== 'en';
  }

  /**
   * Toggle between original and English translation
   * Now uses backend API endpoint
   */
  toggleEnglishTranslation(): void {
    if (this.showingEnglish) {
      // Switch back to original
      this.showingEnglish = false;
      return;
    }

    if (this.englishTranslation) {
      // Already have translation, just toggle
      this.showingEnglish = true;
      return;
    }

    // Use backend translation endpoint
    this.isTranslating = true;
    const textToTranslate = this.message.response || '';

    this.translationService.translateText(
      textToTranslate,
      this.currentLanguage,
      'en',
      this.message.id,
      'chat'
    ).subscribe({
      next: (response) => {
        this.englishTranslation = response.translatedText;
        this.showingEnglish = true;
        this.isTranslating = false;

        // Log translation analytics
        console.log(`Translation completed: ${response.sourceLanguage} → ${response.targetLanguage}`, {
          fromCache: response.fromCache,
          provider: response.provider,
          messageId: this.message.id
        });
      },
      error: (error) => {
        console.error('Backend translation failed:', error);
        this.isTranslating = false;
        // Show user-friendly error message
        this.englishTranslation = 'Translation temporarily unavailable. Please try again later.';
        this.showingEnglish = true;
      }
    });
  }

  /**
   * Get the display name for the current language
   */
  getLanguageName(): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'ak': 'Akan',
      'gaa': 'Ga',
      'ee': 'Ewe',
      'ha': 'Hausa',
      'dag': 'Dagbani'
    };
    return languageNames[this.currentLanguage] || this.currentLanguage;
  }

  /**
   * Get the content to display
   */
  getDisplayContent(): string {
    if (this.message.isFromUser) {
      return this.message.message || '';
    }

    if (this.showingEnglish && this.englishTranslation) {
      return this.englishTranslation;
    }

    return this.message.response || '';
  }

  formatContent(content: string): string {
    // Replace double newlines with <br><br> for paragraphs
    let formatted = content.replace(/\n\n/g, '<br><br>');
    // Replace single newlines with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    // Add <br> before headings only if not already preceded by <br>
    formatted = formatted.replace(/([^<br>])?(\*\*[^*]+\*\*)/g, function(match, p1, p2) {
      return (p1 && p1 !== '<br>') ? '<br>' + p2 : p2;
    });
    // Remove extra <br> at start if present
    formatted = formatted.replace(/^<br>/, '');
    return formatted;
  }



    formatMessageContent(content: string): string {
      if (!content) return content

      const formatted = content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/^### (.*$)/gm, '<strong class=" font-semibold text-black mb-1 mt-2">$1</strong>')
        .replace(/\n/g, "<br>")
    return formatted
  }
}
