import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bot, Eye, EyeOff, Lock, LucideAngularModule, Mail } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth';
import { ToastService } from 'src/app/services/toast.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toastService.warning("Please fill in all fields", "Validation Error")
      return
    }

    this.isLoading = true

    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false
        if (success) {
          this.toastService.success("Welcome back! Redirecting to chat...", "Login Successful")
          this.router.navigate(["/chatV2"])
        } else {
          this.toastService.error("Invalid email or password. Please try again.", "Login Failed")
        }
      },
      error: () => {
        this.isLoading = false
        this.toastService.error("Something went wrong. Please try again later.", "Login Error")
      },
    })

  }

  onForgotPassword(): void {
    // Handle forgot password logic
    console.log("Forgot password clicked")
  }

  onSignUp(): void {
    this.router.navigate(["/register"])
    console.log("Sign up clicked")
  }
}
