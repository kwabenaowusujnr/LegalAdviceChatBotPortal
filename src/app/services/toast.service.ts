import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string
  title?: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(toast: Omit<Toast, 'id'>): string {
    const id = this.generateId();

    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    if(newToast.duration && newToast.duration > 0) {
      // setTimeout(() => {
      //   this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
      // }, newToast.duration);
      setTimeout(() => {
        this.dismiss(id)
      }, newToast.duration)
    }

    return id;
  }

  public success(message: string, title?: string, duration?: number): string {
    return this.show({ message, title, type: "success", duration });
  }

  public error(message: string, title?: string, duration?: number): string {
    return this.show({ message, title, type: "error", duration });
  }

  public warning(message: string, title?: string, duration?: number): string {
    return this.show({ message, title, type: "warning", duration });
  }

  public info(message: string, title?: string, duration?: number): string {
    return this.show({ message, title, type: "info", duration });
  }

  public dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }

  public dismissAll(): void {
    this.toastsSubject.next([]);
  }

  constructor() { }
}
