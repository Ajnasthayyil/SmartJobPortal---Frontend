import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(toast.id), 3500);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error'); }
  info(message: string)    { this.show(message, 'info'); }

  remove(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}