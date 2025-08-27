import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  isDarkMode = false

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode
    document.documentElement.classList.toggle("dark", this.isDarkMode)
  }

  openSettings() {
    console.log("Opening settings...")
  }

  openProfile() {
    console.log("Opening profile...")
  }

  toggleMenu() {
    console.log("Toggling menu...")
  }
}
