import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../../core/models/Message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-window',
  imports: [CommonModule],
  templateUrl: './message-window.component.html',
  styleUrl: './message-window.component.css'
})
export class MessageWindowComponent {
  @Input() message!: Message
  @Output() feedbackSelected = new EventEmitter<{ messageId: string; feedback: "good" | "bad" | "custom" }>()


  onFeedback(feedback: "good" | "bad" | "custom") {
    this.feedbackSelected.emit({
      messageId: this.message.id,
      feedback,
    })
  }

  formatContent(content: string): string {
    return content.replace(/\n/g, "<br>")
  }
}
