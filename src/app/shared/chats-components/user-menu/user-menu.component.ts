import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { HelpCircle, LogOut, LucideAngularModule, Settings, User } from 'lucide-angular';
import { SettingsModalComponent } from '../../settings-modal/settings-modal.component';
import { ProfileManagementModalComponent } from '../../profile-management-modal/profile-management-modal.component';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, LucideAngularModule, ProfileManagementModalComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent implements OnInit {
  isOpen = false;
  showSettingsModal = false;

  // User data
  currentUser: any = null;
  userInitials = '';
  userName = '';
  userEmail = '';

  // Icons
  userIcon = User
  settingsIcon = Settings
  logOutIcon = LogOut
  helpIcon = HelpCircle

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      // Set user name - try different possible fields
      this.userName = this.getUserDisplayName();

      // Set user email
      this.userEmail = this.currentUser.email || this.currentUser.userName || 'user@example.com';

      // Generate initials
      this.userInitials = this.generateInitials();
    } else {
      // Fallback values if no user data
      this.userName = 'User';
      this.userEmail = 'user@example.com';
      this.userInitials = 'U';
    }
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';

    // Try to get full name from firstName and lastName
    if (this.currentUser.firstName || this.currentUser.lastName) {
      const firstName = this.currentUser.firstName || '';
      const lastName = this.currentUser.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'User';
    }

    // Try userName field
    if (this.currentUser.userName) {
      return this.currentUser.userName;
    }

    // Try name field
    if (this.currentUser.name) {
      return this.currentUser.name;
    }

    // Use email prefix as last resort
    if (this.currentUser.email) {
      return this.currentUser.email.split('@')[0];
    }

    return 'User';
  }

  generateInitials(): string {
    if (!this.currentUser) return 'U';

    // Try to generate from firstName and lastName
    if (this.currentUser.firstName || this.currentUser.lastName) {
      const firstInitial = this.currentUser.firstName ? this.currentUser.firstName[0].toUpperCase() : '';
      const lastInitial = this.currentUser.lastName ? this.currentUser.lastName[0].toUpperCase() : '';

      if (firstInitial && lastInitial) {
        return firstInitial + lastInitial;
      } else if (firstInitial) {
        return firstInitial;
      } else if (lastInitial) {
        return lastInitial;
      }
    }

    // Try to generate from userName or name
    const nameField = this.currentUser.userName || this.currentUser.name || this.currentUser.email;
    if (nameField) {
      const parts = nameField.split(/[\s@._-]+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return nameField[0].toUpperCase();
    }

    return 'U';
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen
  }

  closeMenu(): void {
    this.isOpen = false
  }

  onSettingsClick(): void {
    this.showSettingsModal = true;
    this.closeMenu()
  }

  onHelpClick(): void {
    this.toastService.info("Help documentation coming soon!", "Feature Not Available")
    console.log("Help clicked")
    this.closeMenu()
  }

  onSignOutClick(): void {
    this.authService.logout().subscribe(() => {
      // Handle successful logout
      this.closeMenu();
      this.router.navigate(["/login"]);
    }, (error) => {
      // Handle logout error
    });
  }

  onCloseSettingsModal(): void {
    this.showSettingsModal = false;
    // Reload user data in case profile was updated
    this.loadUserData();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement
    if (!target.closest(".user-menu-container")) {
      this.closeMenu()
    }
  }
}
