import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let t of toastService.toasts(); trackBy: trackById"
        class="toast-item"
        [class.toast-success]="t.type === 'success'"
        [class.toast-error]="t.type === 'error'"
        [class.toast-info]="t.type === 'info'"
        [class.toast-warning]="t.type === 'warning'"
        [class.toast-removing]="t.removing"
        (click)="dismiss(t.id)"
        role="alert"
      >
        <!-- Icon -->
        <span class="toast-icon">
          <svg *ngIf="t.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <svg *ngIf="t.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg *ngIf="t.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <svg *ngIf="t.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>

        <!-- Message -->
        <span class="toast-message">{{ t.message }}</span>

        <!-- Close button -->
        <button class="toast-close" (click)="dismiss(t.id); $event.stopPropagation()" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Progress bar -->
        <div class="toast-progress"></div>
      </div>
    </div>
  `,
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}

  trackById(_: number, item: Toast): number {
    return item.id;
  }

  dismiss(id: number): void {
    this.toastService.remove(id);
  }
}
