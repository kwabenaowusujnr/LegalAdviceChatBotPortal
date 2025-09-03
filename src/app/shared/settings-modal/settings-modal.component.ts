import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bell, Globe, LucideAngularModule, Moon, Palette, Shield, Sun, User, X } from 'lucide-angular';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent {
  @Input() isOpen = false
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
    console.log("Settings saved:", this.settings)
    this.closeModal.emit()
  }

  onReset(): void {
    // Reset to default values
    this.settings = {
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
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    this.onClose()
  }
}
