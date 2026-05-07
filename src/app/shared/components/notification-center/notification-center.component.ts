import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed-overlay" (click)="close.emit()">
      <div class="message-center" (click)="$event.stopPropagation()">
        
        <!-- Header with Logo -->
        <header class="panel-header">
          <div class="header-main">
             <div class="logo-box">
                <i class="fa-solid fa-bolt"></i>
             </div>
             <div class="header-text">
                <h3>Notifications</h3>
                <p *ngIf="ns.unreadCount() > 0">{{ ns.unreadCount() }} unread messages</p>
                <p *ngIf="ns.unreadCount() === 0">No new alerts</p>
             </div>
          </div>
          <button class="icon-close" (click)="close.emit()" title="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <!-- Notification List -->
        <div class="panel-body custom-scrollbar">
          <div *ngIf="ns.notifications().length === 0" class="empty-view">
            <i class="fa-solid fa-bell-slash"></i>
            <p>Your inbox is clear</p>
          </div>

          <div *ngFor="let n of ns.notifications()" 
               class="notif-card" 
               [class.unread]="!n.isRead"
               (click)="onNotifClick(n)">
            
            <div class="card-icon">
              {{ ns.getTypeIcon(n.type) }}
            </div>

            <div class="card-content">
              <div class="card-top">
                <span class="type">{{ n.type }}</span>
                <span class="time">{{ n.timeAgo }}</span>
              </div>

              <!-- Position & Company Info -->
              <div class="job-meta" *ngIf="n.jobTitle || n.companyName">
                <span class="pos" *ngIf="n.jobTitle">{{ n.jobTitle }}</span>
                <span class="sep" *ngIf="n.jobTitle && n.companyName">at</span>
                <span class="comp" *ngIf="n.companyName">{{ n.companyName }}</span>
              </div>

              <h4 class="notif-title">{{ n.title }}</h4>
              <p class="notif-msg">{{ n.message }}</p>
            </div>
            
            <div class="indicator" *ngIf="!n.isRead"></div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="panel-footer">
          <button class="btn-mark" (click)="ns.markAllAsRead()" *ngIf="ns.unreadCount() > 0">
            Mark all read
          </button>
          <button class="btn-refresh" (click)="ns.loadAll()" title="Refresh">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </footer>

      </div>
    </div>
  `,
  styles: [`
    .fixed-overlay {
      position: fixed !important;
      inset: 0 !important;
      background: transparent !important; /* Removed black background */
      z-index: 999999 !important;
      display: flex !important;
      align-items: flex-start !important;
      justify-content: flex-end !important; /* Align to RIGHT */
      padding: 80px 30px !important; /* Padding from top and right */
    }

    .message-center {
      width: 100%;
      max-width: 460px;
      background: #ffffff;
      border-radius: 28px;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15); /* Softer shadow for no-backdrop look */
      display: flex;
      flex-direction: column;
      max-height: 80vh;
      overflow: hidden;
      border: 1px solid #eef2f6;
      animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .panel-header {
      padding: 24px 30px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-box {
      width: 42px;
      height: 42px;
      background: #10b981;
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .header-text h3 {
      margin: 0;
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
    }

    .header-text p {
      margin: 2px 0 0;
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    .icon-close {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      border: none;
      background: #f8fafc;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      &:hover { background: #fee2e2; color: #ef4444; }
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
      background: #fafbfc;
    }

    .notif-card {
      padding: 18px 30px;
      display: flex;
      gap: 18px;
      cursor: pointer;
      border-bottom: 1px solid #f1f5f9;
      transition: all 0.2s;
      position: relative;
      background: #ffffff;
      &:hover { background: #f8fafc; transform: translateX(-4px); } /* Slide left slightly on hover */
      &.unread { background: #f0fdf4; }
    }

    .card-icon {
      font-size: 24px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-content {
      flex: 1;
      min-width: 0;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      .type { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
      .time { font-size: 11px; color: #94a3b8; }
    }

    .job-meta {
      margin-bottom: 6px;
      font-size: 12px;
      color: #10b981;
      display: flex;
      gap: 4px;
      align-items: center;
      .pos { font-weight: 800; }
      .sep { color: #94a3b8; }
      .comp { font-weight: 600; color: #64748b; }
    }

    .notif-title {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .notif-msg {
      margin: 0;
      font-size: 13px;
      color: #64748b;
      line-height: 1.5;
    }

    .indicator {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }

    .panel-footer {
      padding: 15px 30px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
    }

    .btn-mark {
      background: none;
      border: none;
      color: #10b981;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }

    .btn-refresh {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      &:hover { color: #10b981; }
    }

    .empty-view {
      padding: 80px 20px;
      text-align: center;
      color: #cbd5e1;
      i { font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.3; }
      p { font-size: 14px; font-weight: 600; }
    }

    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class NotificationCenterComponent {
  @Output() close = new EventEmitter<void>();

  constructor(public ns: NotificationService) {}

  onNotifClick(n: any): void {
    if (!n.isRead) {
      this.ns.markAsRead(n.notificationId);
    }
  }
}
