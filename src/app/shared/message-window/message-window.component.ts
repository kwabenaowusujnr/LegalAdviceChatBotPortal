import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../../core/models/Message';
import { CommonModule } from '@angular/common';
import { ChatMessage } from 'src/app/services/api-client';

@Component({
  selector: 'app-message-window',
  imports: [CommonModule],
  templateUrl: './message-window.component.html',
  styleUrl: './message-window.component.css'
})
export class MessageWindowComponent {
  @Input() message!: ChatMessage
  @Output() feedbackSelected = new EventEmitter<{ messageId: string; feedback: "good" | "bad" | "custom" }>()


  onFeedback(feedback: "good" | "bad" | "custom") {
    this.feedbackSelected.emit({
      messageId: this.message.id?.toString() || '',
      feedback,
    })
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
          .replace(/^### (.*$)/gm, '<strong class="text-lg font-semibold text-black mb-1 mt-2">$1</strong>')
        .replace(/\n/g, "<br>")
    return formatted
  }
}
