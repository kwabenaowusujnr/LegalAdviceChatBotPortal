import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bell, Globe, Key, LucideAngularModule, Moon, Palette, Shield, Sun, User, X, Eye, EyeOff } from 'lucide-angular';
import { ToastService } from 'src/app/services/toast.service';
import { ServiceProxy, ChangePasswordRequest } from 'src/app/services/api-client';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  keyIcon = Key
  eyeIcon = Eye
  eyeOffIcon = EyeOff

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
    security: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  }

  // Password visibility toggles
  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false

  // Password validation
  passwordErrors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  // Loading state for password change
  isChangingPassword = false

  constructor(
    private toastService: ToastService,
    private apiService: ServiceProxy
  ) {
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
      security: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
    { id: "security", label: "Security", icon: this.keyIcon },
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
    // Clear password fields when closing
    this.settings.security.currentPassword = ""
    this.settings.security.newPassword = ""
    this.settings.security.confirmPassword = ""
    this.passwordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    this.showCurrentPassword = false
    this.showNewPassword = false
    this.showConfirmPassword = false
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

  // Password change methods
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword
        break
      case 'new':
        this.showNewPassword = !this.showNewPassword
        break
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword
        break
    }
  }

  validatePassword(field: 'current' | 'new' | 'confirm'): void {
    this.passwordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    // Validate current password
    if (field === 'current' && !this.settings.security.currentPassword) {
      this.passwordErrors.currentPassword = "Current password is required"
    }

    // Validate new password
    if ((field === 'new' || field === 'confirm') && this.settings.security.newPassword) {
      if (this.settings.security.newPassword.length < 8) {
        this.passwordErrors.newPassword = "Password must be at least 8 characters long"
      } else if (!/(?=.*[a-z])/.test(this.settings.security.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one lowercase letter"
      } else if (!/(?=.*[A-Z])/.test(this.settings.security.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one uppercase letter"
      } else if (!/(?=.*\d)/.test(this.settings.security.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one number"
      } else if (!/(?=.*[@$!%*?&])/.test(this.settings.security.newPassword)) {
        this.passwordErrors.newPassword = "Password must contain at least one special character"
      }
    }

    // Validate confirm password
    if (field === 'confirm' && this.settings.security.confirmPassword) {
      if (this.settings.security.newPassword !== this.settings.security.confirmPassword) {
        this.passwordErrors.confirmPassword = "Passwords do not match"
      }
    }
  }

  getPasswordStrength(): { strength: string; color: string; width: string } {
    const password = this.settings.security.newPassword
    if (!password) {
      return { strength: '', color: '', width: '0%' }
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++

    switch (strength) {
      case 0:
      case 1:
        return { strength: 'Weak', color: 'bg-red-500', width: '20%' }
      case 2:
        return { strength: 'Fair', color: 'bg-orange-500', width: '40%' }
      case 3:
        return { strength: 'Good', color: 'bg-yellow-500', width: '60%' }
      case 4:
        return { strength: 'Strong', color: 'bg-green-500', width: '80%' }
      case 5:
        return { strength: 'Very Strong', color: 'bg-green-600', width: '100%' }
      default:
        return { strength: '', color: '', width: '0%' }
    }
  }

  onChangePassword(): void {
    // Validate all fields
    this.validatePassword('current')
    this.validatePassword('new')
    this.validatePassword('confirm')

    // Check if there are any errors
    if (this.passwordErrors.currentPassword ||
        this.passwordErrors.newPassword ||
        this.passwordErrors.confirmPassword) {
      this.toastService.error("Please fix the errors before submitting", "Validation Error")
      return
    }

    // Check if all fields are filled
    if (!this.settings.security.currentPassword ||
        !this.settings.security.newPassword ||
        !this.settings.security.confirmPassword) {
      this.toastService.error("Please fill in all password fields", "Missing Information")
      return
    }

    // Create the request object
    const request = new ChangePasswordRequest()
    request.currentPassword = this.settings.security.currentPassword
    request.newPassword = this.settings.security.newPassword
    request.confirmNewPassword = this.settings.security.confirmPassword

    // Set loading state
    this.isChangingPassword = true

    // Call the API
    this.apiService.changePassword(request)
      .pipe(
        catchError((error) => {
          console.error('Password change error:', error)

          // Handle specific error messages
          if (error.status === 400) {
            if (error.response && error.response.includes('current password')) {
              this.toastService.error("Current password is incorrect", "Authentication Error")
            } else if (error.response && error.response.includes('match')) {
              this.toastService.error("New passwords do not match", "Validation Error")
            } else {
              this.toastService.error("Invalid password change request", "Error")
            }
          } else if (error.status === 401) {
            this.toastService.error("You are not authorized. Please login again.", "Authorization Error")
          } else {
            this.toastService.error("Failed to change password. Please try again.", "Error")
          }

          this.isChangingPassword = false
          return of(null)
        })
      )
      .subscribe((response) => {
        this.isChangingPassword = false

        if (response !== null) {
          // Success
          this.toastService.success("Your password has been changed successfully", "Password Changed")

          // Clear the password fields
          this.settings.security.currentPassword = ""
          this.settings.security.newPassword = ""
          this.settings.security.confirmPassword = ""

          // Reset visibility
          this.showCurrentPassword = false
          this.showNewPassword = false
          this.showConfirmPassword = false

          // Switch to general tab
          this.activeTab = "general"
        }
      })
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    this.onClose()
  }
}
