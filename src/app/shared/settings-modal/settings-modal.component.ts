import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bell, Globe, LucideAngularModule, Moon, Palette, Shield, Sun, User, X } from 'lucide-angular';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent implements OnChanges {
  @Input() isOpen = false
  @Input() userData: any = null
  @Output() closeModal = new EventEmitter<void>()

  // Icons
  closeIcon = X
  userIcon = User
  paletteIcon = Palette
  shieldIcon = Shield
  bellIcon = Bell
  globeIcon = Globe
  moonIcon = Moon
  sunIcon = Sun

  // Settings state
  activeTab = "general"
  settings = {
    general: {
      username: "KhrossGh",
      email: "khross@example.com",
      language: "en",
      timezone: "UTC",
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      compactMode: false,
      animations: true,
    },
    privacy: {
      dataCollection: true,
      analytics: false,
      shareUsage: true,
      publicProfile: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      soundEnabled: true,
      desktopNotifications: true,
    },
  }
  constructor(private toastService: ToastService) {
    this.initializeSettings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.updateSettingsWithUserData();
    }
  }

  initializeSettings(): void {
    // Initialize with default values
    this.settings = {
      general: {
        username: "User",
        email: "user@example.com",
        language: "en",
        timezone: "UTC",
      },
      appearance: {
        theme: "light",
        fontSize: "medium",
        compactMode: false,
        animations: true,
      },
      privacy: {
        dataCollection: true,
        analytics: false,
        shareUsage: true,
        publicProfile: false,
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        soundEnabled: true,
        desktopNotifications: true,
      },
    };
  }

  updateSettingsWithUserData(): void {
    if (this.userData) {
      // Update general settings with actual user data
      this.settings.general.username = this.getUserDisplayName();
      this.settings.general.email = this.userData.email || 'user@example.com';

      // You can add more user-specific settings here if available
      if (this.userData.language) {
        this.settings.general.language = this.userData.language;
      }
      if (this.userData.timezone) {
        this.settings.general.timezone = this.userData.timezone;
      }
    }
  }

  getUserDisplayName(): string {
    if (!this.userData) return 'User';

    // Try to get full name from firstName and lastName
    if (this.userData.firstName || this.userData.lastName) {
      const firstName = this.userData.firstName || '';
      const lastName = this.userData.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'User';
    }

    // Try userName field
    if (this.userData.userName) {
      return this.userData.userName;
    }

    // Try name field
    if (this.userData.name) {
      return this.userData.name;
    }

    // Use email prefix as last resort
    if (this.userData.email) {
      return this.userData.email.split('@')[0];
    }

    return 'User';
  }

  tabs = [
    { id: "general", label: "General", icon: this.userIcon },
    { id: "appearance", label: "Appearance", icon: this.paletteIcon },
    { id: "privacy", label: "Privacy", icon: this.shieldIcon },
    { id: "notifications", label: "Notifications", icon: this.bellIcon },
  ]

  languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ]

  timezones = [
    { value: "UTC", label: "UTC" },
    { value: "EST", label: "Eastern Time" },
    { value: "PST", label: "Pacific Time" },
    { value: "GMT", label: "Greenwich Mean Time" },
  ]

  themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "auto", label: "Auto" },
  ]

  fontSizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ]

  setActiveTab(tabId: string): void {
    this.activeTab = tabId
  }

  onClose(): void {
    this.closeModal.emit()
  }

  onSave(): void {
    this.toastService.success("Your settings have been saved successfully", "Settings Saved")
    console.log("Settings saved:", this.settings)
    this.closeModal.emit()
  }

  onReset(): void {
    // Reset to default values with user data
    this.initializeSettings();
    this.updateSettingsWithUserData();
    this.toastService.info("Settings have been reset to default values", "Settings Reset")
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    this.onClose()
  }
}
