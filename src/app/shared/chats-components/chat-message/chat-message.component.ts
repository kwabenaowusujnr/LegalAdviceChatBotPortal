import { Component, Input } from '@angular/core';
import { ChatMessage } from 'src/app/core/models/Message';
import { Bot, User, LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
 @Input() message!: ChatMessage

  // Icons
  botIcon = Bot
  userIcon = User

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }


}
