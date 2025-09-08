import { Component } from '@angular/core';
import { ToastComponent } from "../toast/toast.component";
import { Subscription } from 'rxjs';
import { Toast, ToastService } from 'src/app/services/toast.service';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [ToastComponent, NgForOf, CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  toasts: Toast[] = []
  private subscription?: Subscription

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  onDismiss(id: string): void {
    this.toastService.dismiss(id)
  }
}
