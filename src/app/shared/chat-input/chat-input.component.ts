import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  @Output() messageSubmitted = new EventEmitter<string>()

  messageText = ""

  onSubmit() {
    if (this.messageText.trim()) {
      this.messageSubmitted.emit(this.messageText.trim())
      this.messageText = ""
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onAttachment() {
    console.log("Opening file attachment...")
  }

  onVoiceInput() {
    console.log("Starting voice input...")
  }
}
