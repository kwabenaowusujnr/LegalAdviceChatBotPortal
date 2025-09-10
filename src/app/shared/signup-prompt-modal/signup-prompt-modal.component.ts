import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LogIn, LucideAngularModule, UserPlus, X } from 'lucide-angular';

@Component({
  selector: 'app-signup-prompt-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './signup-prompt-modal.component.html',
  styleUrl: './signup-prompt-modal.component.css'
})
export class SignupPromptModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() isOpen = false

  xIcon = X
  userPlusIcon = UserPlus
  logInIcon = LogIn

  constructor(private router: Router) { }

  onClose(): void {
    this.close.emit()
  }

  onSignUp(): void {
    this.router.navigate(["/register"])
    this.onClose()
  }

  onSignIn(): void {
    this.router.navigate(["/login"])
    this.onClose()
  }
}
