import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bot, Eye, EyeOff, Globe, Lock, LucideAngularModule, Mail, Phone, User } from 'lucide-angular';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AuthService } from 'src/app/services/auth';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly EyeIcon = Eye
  readonly EyeOffIcon = EyeOff
  readonly MailIcon = Mail
  readonly LockIcon = Lock
  readonly BotIcon = Bot
  readonly UserIcon = User
  readonly PhoneIcon = Phone
  readonly GlobeIcon = Globe

  firstName = ""
  lastName = ""
  email = ""
  password = ""
  confirmPassword = ""
  phoneNumber = ""
  region = ""
  showPassword = false
  showConfirmPassword = false
  isLoading = false
  agreeToTerms = false


  regions = [
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Western", label: "Western" },
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Volta", label: "Volta" },
    { value: "Northern", label: "Northern" },
    { value: "Upper East", label: "Upper East" },
    { value: "Upper West", label: "Upper West" },
    { value: "Brong-Ahafo", label: "Brong-Ahafo" },
    { value: "Western North", label: "Western North" },
    { value: "Ahafo", label: "Ahafo" },
    { value: "Bono East", label: "Bono East" },
    { value: "Oti", label: "Oti" },
    { value: "North East", label: "North East" },
    { value: "Savannah", label: "Savannah" },
    { value: "OTHER", label: "Other" },
  ]

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private analyticsService: AnalyticsService
  ) { }

  onSignIn(): void {
    this.router.navigate(["/login"])
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword || !this.region) {
      this.toastService.warning("Please fill in all required fields", "Validation Error")
      return
    }

    if (this.password !== this.confirmPassword) {
      this.toastService.error("Passwords do not match", "Validation Error")
      return
    }

    if (this.password.length < 6) {
      this.toastService.error("Password must be at least 6 characters long", "Validation Error")
      return
    }

    if (!this.agreeToTerms) {
      this.toastService.warning("Please agree to the Terms of Service", "Validation Error")
      return
    }

    this.analyticsService.trackEvent('register_attempt', 'User attempted registration', 'engagement');

    this.isLoading = true

    const userData = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber || undefined,
      region: this.region,
    }

    this.authService.register(userData).subscribe({
      next: (success) => {
        this.isLoading = false
        if (success) {
          this.toastService.success("Account created successfully! Redirecting to chat...", "Registration Successful")
          this.router.navigate(["/chatV2"])
        } else {
          this.toastService.error("Registration failed. Please try again.", "Registration Failed")
        }
      },
      error: (error) => {
        this.isLoading = false
        const errorMessage = error?.error?.message || "Something went wrong. Please try again later."
        this.toastService.error(errorMessage, "Registration Error")
      },
    })
  }
}
