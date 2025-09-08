import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from "@angular/common"
import { LucideAngularModule, Menu, Plus, MessageSquare, Book, Compass, Settings, ChevronDown, X } from "lucide-angular"
import { NavigationSection } from 'src/app/core/models/Message';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-sidebar-v2',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.css']
})
export class SidebarV2Component {
@Output() closeSidebar = new EventEmitter<void>()
@Output() newChat = new EventEmitter<void>()

 isExpanded = true;

  // Icons
  menuIcon = Menu
  plusIcon = Plus
  messageIcon = MessageSquare
  bookIcon = Book
  compassIcon = Compass
  settingsIcon = Settings
  chevronIcon = ChevronDown
  closeIcon = X

  constructor(
    private router: Router,
    public authService: AuthService,
  ){

  }

  navigationSections: NavigationSection[] = [
    //    {
    //   title: "Recent",
    //   items: [{ label: "Angular Tailwind AI Chat Portal", isActive: false }],
    //   isCollapsible: true,
    //   isExpanded: true,
    // },
  ]

  onCloseSidebar(): void {
    this.closeSidebar.emit()
  }

  toggleSection(section: NavigationSection): void {
    if (section.isCollapsible) {
      section.isExpanded = !section.isExpanded
      this.isExpanded = !this.isExpanded;
    }
  }


  navigateToLogin(): void {
    this.router.navigate(["/login"])
    this.closeSidebar.emit() // Close sidebar on mobile after navigation
  }

  onNewChat(): void {
    this.newChat.emit()
    this.closeSidebar.emit() // Close sidebar on mobile after navigation
  }
}
