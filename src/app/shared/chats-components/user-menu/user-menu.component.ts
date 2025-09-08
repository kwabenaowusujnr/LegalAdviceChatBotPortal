import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HelpCircle, LogOut, LucideAngularModule, Settings, User } from 'lucide-angular';
import { SettingsModalComponent } from '../../settings-modal/settings-modal.component';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth';

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

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  toggleMenu(): void {
    this.isOpen = !this.isOpen
  }

  closeMenu(): void {
    this.isOpen = false
  }

  onProfileClick(): void {
    this.toastService.info("Profile management coming soon!", "Feature Not Available")
    console.log("Profile clicked")
    this.closeMenu()
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
