import { Component } from '@angular/core';
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatInputComponent } from "../chat-input/chat-input.component";
import { MessageWindowComponent } from "../message-window/message-window.component";
import { Message } from '../../core/models/Message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-area',
  imports: [ChatHeaderComponent, ChatInputComponent, MessageWindowComponent, CommonModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css'
})
export class ChatAreaComponent {
  messages: Message[] = [

  ];

  onSendMessage(content: string) {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    this.messages.push(newMessage)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "Thanks for your message! How can I help you further?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      this.messages.push(aiResponse)
    }, 1000)
  }
}
