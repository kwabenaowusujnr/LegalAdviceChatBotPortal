import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HelpCircle, LogOut, LucideAngularModule, Settings, User } from 'lucide-angular';
import { SettingsModalComponent } from '../../settings-modal/settings-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, LucideAngularModule, SettingsModalComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
  isOpen = false;
  showSettingsModal = false;

  // Icons
  userIcon = User
  settingsIcon = Settings
  logOutIcon = LogOut
  helpIcon = HelpCircle

  constructor(private router: Router) { }

  toggleMenu(): void {
    this.isOpen = !this.isOpen
  }

  closeMenu(): void {
    this.isOpen = false
  }

  onProfileClick(): void {
    console.log("Profile clicked")
    this.closeMenu()
  }

  onSettingsClick(): void {
    this.showSettingsModal = true;
    this.closeMenu()
  }

  onHelpClick(): void {
    console.log("Help clicked")
    this.closeMenu()
  }

  onSignOutClick(): void {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    sessionStorage.clear()

    this.closeMenu()
    this.router.navigate(["/login"])
  }

  onCloseSettingsModal(): void {
    this.showSettingsModal = false
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement
    if (!target.closest(".user-menu-container")) {
      this.closeMenu()
    }
  }
}
