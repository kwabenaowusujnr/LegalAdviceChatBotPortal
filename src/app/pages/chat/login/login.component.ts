import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bot, Eye, EyeOff, Lock, LucideAngularModule, Mail } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly EyeIcon = Eye
  readonly EyeOffIcon = EyeOff
  readonly MailIcon = Mail
  readonly LockIcon = Lock
  readonly BotIcon = Bot

  email = ""
  password = ""
  showPassword = false
  isLoading = false
  rememberMe = false

  constructor(private router: Router) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      return
    }

    this.isLoading = true

    // Simulate login API call
    setTimeout(() => {
      this.isLoading = false
      // Navigate to chat after successful login
      this.router.navigate(["/chatV2"])
    }, 1500)
  }

  onForgotPassword(): void {
    // Handle forgot password logic
    console.log("Forgot password clicked")
  }

  onSignUp(): void {
    // Handle sign up navigation
    console.log("Sign up clicked")
  }
}
