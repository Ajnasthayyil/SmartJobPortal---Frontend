import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  removing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const toast: Toast = { id: this.nextId++, message, type, removing: false };
    this.toasts.update(t => [...t, toast]);

    // Start exit animation before removing
    setTimeout(() => this.startRemove(toast.id), duration);
  }

  success(message: string, duration?: number) { this.show(message, 'success', duration); }
  error(message: string, duration?: number)   { this.show(message, 'error', duration); }
  info(message: string, duration?: number)    { this.show(message, 'info', duration); }
  warning(message: string, duration?: number) { this.show(message, 'warning', duration); }

  /** Trigger exit animation, then remove after 400ms */
  private startRemove(id: number): void {
    this.toasts.update(t =>
      t.map(x => (x.id === id ? { ...x, removing: true } : x))
    );
    setTimeout(() => this.remove(id), 400);
  }

  remove(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}