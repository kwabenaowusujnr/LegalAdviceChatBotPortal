import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertCircle, AlertTriangle, CheckCircle, Info, LucideAngularModule, X } from 'lucide-angular';
import { Toast } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() toast!: Toast
  @Output() dismiss = new EventEmitter<string>()

  // Icons
  readonly X = X
  readonly CheckCircle = CheckCircle
  readonly AlertCircle = AlertCircle
  readonly AlertTriangle = AlertTriangle
  readonly Info = Info

  onDismiss(): void {
    this.dismiss.emit(this.toast.id)
  }

  onActionClick(): void {
    if (this.toast.action) {
      this.toast.action.handler()
      this.onDismiss()
    }
  }

  getIcon() {
    switch (this.toast.type) {
      case "success":
        return this.CheckCircle
      case "error":
        return this.AlertCircle
      case "warning":
        return this.AlertTriangle
      case "info":
        return this.Info
      default:
        return this.Info
    }
  }

  getTypeClasses(): string {
    switch (this.toast.type) {
      case "success":
        return "bg-forest/10 border-forest text-forest"
      case "error":
        return "bg-deepred/10 border-deepred text-deepred"
      case "warning":
        return "bg-amber/10 border-amber text-amber"
      case "info":
        return "bg-royal/10 border-royal text-royal"
      default:
        return "bg-royal/10 border-royal text-royal"
    }
  }
}
