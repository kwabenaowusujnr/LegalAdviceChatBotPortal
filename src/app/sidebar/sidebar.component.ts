import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatHistory {
  title: string
  active?: boolean
}

interface ChatSection {
  title: string
  expanded: boolean
  chats: ChatHistory[]
}


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  searchQuery = ""

  chatSections: ChatSection[] = [
    // {
    //   title: "Today",
    //   expanded: true,
    //   chats: [
    //     { title: "Planning a Tropical Vacation" },
    //     { title: "Top Travel Destinations" },
    //     { title: "Finding Luxury Accommodations", active: true },
    //     { title: "Best Attractions in Bali" },
    //     { title: "Packing Tips for a Beach Vacation" },
    //   ],
    // },
    // {
    //   title: "Previous 7 Days",
    //   expanded: true,
    //   chats: [
    //     { title: "Exploring Cultural Sites" },
    //     { title: "Adventure Activities Abroad" },
    //     { title: "Budget Travel Tips" },
    //     { title: "Top Restaurants in Bali" },
    //     { title: "Vacation Itinerary Ideas" },
    //   ],
    // },
    // {
    //   title: "Previous 3 Months",
    //   expanded: true,
    //   chats: [{ title: "Places to visit in Jakarta" }],
    // },
  ]

  toggleSection(section: ChatSection) {
    section.expanded = !section.expanded
  }

  selectChat(chat: ChatHistory) {
    // Reset all active states
    this.chatSections.forEach((section) => {
      section.chats.forEach((c) => (c.active = false))
    })
    // Set selected chat as active
    chat.active = true
  }

  newChat() {
    console.log("Starting new chat...")
  }

  // Add this method to handle menu toggle from header
  onMenuToggle() {
    this.toggleSidebar();
  }

  toggleSidebar() {
    // Implement your sidebar toggle logic here
    // For example, toggle a collapsed state
    // this.collapsed = !this.collapsed;
    // If you use a signal or other state, update accordingly
  }
}
