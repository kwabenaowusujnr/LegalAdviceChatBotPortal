import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loader, LucideAngularModule, Mic, Plus, Send, Settings } from 'lucide-angular';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  @Input() isLoading = false
  @Output() messageSubmit = new EventEmitter<string>()

  inputValue = ""

  // Icons
  plusIcon = Plus
  settingsIcon = Settings
  micIcon = Mic
  loaderIcon = Loader
  sendIcon = Send

  get canSubmit(): boolean {
    return this.inputValue.trim().length > 0 && !this.isLoading
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onSubmit(): void {
    if (this.canSubmit) {
      this.messageSubmit.emit(this.inputValue.trim())
      this.inputValue = ""
    }
  }
}
