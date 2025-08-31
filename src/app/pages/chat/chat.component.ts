import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Menu } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ChatMessage, Message } from 'src/app/core/models/Message';
import { ChatMessageComponent } from 'src/app/shared/chats-components/chat-message/chat-message.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SidebarV2Component } from "src/app/shared/chats-components/sidebar-v2/sidebar-v2.component";
import { ChatInputComponent } from 'src/app/shared/chats-components/chat-input/chat-input.component';
import { MessageWindowComponent } from "src/app/shared/message-window/message-window.component";

@Component({
  selector: 'app-chat',
  imports: [CommonModule, SidebarV2Component, ChatInputComponent, LucideAngularModule, SidebarV2Component, MessageWindowComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  //messages: ChatMessage[] = []
  isLoading = false
  isSidebarOpen = false

  // Icons
  menuIcon = Menu

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  closeSidebar(): void {
    this.isSidebarOpen = false
  }
/*
  onMessageSubmit(message: string): void {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }
    this.messages.push(userMessage)

    // Simulate bot response
    this.isLoading = true
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        content: "Hello! I'm NsemBot. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      this.messages.push(botMessage)
      this.isLoading = false
    }, 1000)
  }

  trackByMessageId(index: number, message: ChatMessage): number {
    return message.id
  }
*/

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

    isDarkMode = false;


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle("dark", this.isDarkMode);
  }

  openSettings() {
    console.log("Opening settings...");
  }

  openProfile() {
    console.log("Opening profile...");
  }
}
