import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationCenterComponent } from '../notification-center/notification-center.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationCenterComponent],
  template: `
    <div class="bell-wrap" (click)="toggleDropdown($event)">

      <!-- Bell icon -->
      <button class="bell-btn" [class.has-unread]="ns.unreadCount() > 0">
        <svg width="20" height="20" fill="none" stroke="currentColor"
             stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span *ngIf="ns.unreadCount() > 0" class="bell-badge">
          {{ ns.unreadCount() > 9 ? '9+' : ns.unreadCount() }}
        </span>
      </button>

      <!-- Dropdown panel -->
      <div *ngIf="open()" class="notif-panel" (click)="$event.stopPropagation()">

        <!-- Panel header -->
        <div class="panel-header">
          <span class="panel-title">Notifications</span>
          <button *ngIf="ns.unreadCount() > 0" 
                  class="mark-all-btn"
                  (click)="ns.markAllAsRead()">
            Mark all read
          </button>
        </div>

        <!-- Notifications list -->
        <div class="notif-list">

          <div style="text-align: center;" *ngIf="ns.notifications().length === 0" class="empty-notif">
            <span style="font-size:32px; color: #cbd5e1;"><i class="fa-solid fa-bell"></i></span>
            <p>No notifications yet</p>
          </div>

          <div *ngFor="let n of ns.notifications(); trackBy: trackByNotifId" 
               class="notif-item"
               [class.unread]="!n.isRead"
               (click)="onNotifClick(n)">
            <div class="notif-icon" [innerHTML]="getTypeIconHtml(n.type)">
            </div>
            <div class="notif-body">
              <div class="notif-title">{{ stripEmojis(n.title) }}</div>
              <div class="notif-message">{{ n.message }}</div>
              <div class="notif-time">{{ n.timeAgo }}</div>
            </div>
            <div *ngIf="!n.isRead" class="unread-dot"></div>
          </div>

        </div>

        <!-- Footer -->
        <div class="panel-footer">
          <button class="view-all-btn" (click)="openCenter($event)">
            View all notifications
          </button>
        </div>

      </div>

    </div>

    <!-- Full Notification Center Modal -->
    <app-notification-center *ngIf="showCenter()" (close)="showCenter.set(false)"></app-notification-center>
  `,
  styles: [`
    .bell-wrap {
      position: relative; display: inline-block;
    }
    .bell-btn {
      width: 44px; height: 44px; border-radius: 50%;
      border: none; background: #ffffff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      position: relative; transition: all .2s; color: #1e293b;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
    }
    .bell-btn:hover { background: #f8fafc; color: #003d4c; }
    .bell-btn.has-unread {
      background: #fff7ed; color: #f97316;
    }
    .bell-badge {
      position: absolute; top: -3px; right: -3px;
      background: #ef4444; color: #fff;
      font-size: 9px; font-weight: 700;
      min-width: 16px; height: 16px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 4px; border: 2px solid #fff;
    }
    .notif-panel {
      position: absolute; top: 50px; right: -10px;
      width: 360px; background: #fff;
      border: 1px solid #e5e7eb; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,.12);
      z-index: 200; overflow: hidden;
      animation: slideDown .2s ease;
    }
    .panel-header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 16px 18px 12px;
      border-bottom: 1px solid #f3f4f6;
    }
    .panel-title {
      font-size: 14px; font-weight: 700; color: #0a0a0a;
    }
    .mark-all-btn {
      font-size: 11px; font-weight: 600; color: #f97316;
      background: none; border: none; cursor: pointer;
      font-family: 'Outfit', sans-serif;
    }
    .notif-list {
      max-height: 360px; overflow-y: auto;
    }
    .notif-item {
      display: flex; gap: 10px; padding: 12px 18px;
      cursor: pointer; transition: background .2s;
      border-bottom: 1px solid #f9fafb; position: relative;
    }
    .notif-item:hover { background: #fffaf5; }
    .notif-item.unread { background: #fffaf5; }
    .notif-icon {
      font-size: 20px; flex-shrink: 0; width: 32px;
      height: 32px; display: flex; align-items: center; justify-content: center;
    }
    .notif-body { flex: 1; min-width: 0; }
    .notif-title {
      font-size: 13px; font-weight: 600; color: #0a0a0a;
      margin-bottom: 2px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    .notif-message {
      font-size: 11px; color: #6b7280; line-height: 1.5;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .notif-time {
      font-size: 10px; color: #9ca3af; margin-top: 4px;
    }
    .unread-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #f97316; flex-shrink: 0; margin-top: 4px;
    }
    .empty-notif {
      display: flex; flex-direction: column; align-items: center;
      padding: 40px 20px; color: #9ca3af; gap: 8px; font-size: 13px;
    }
    .panel-footer {
      padding: 12px 18px; border-top: 1px solid #f3f4f6;
      text-align: center;
    }
    .view-all-btn {
      width: 100%; padding: 8px; border: none; background: none;
      font-size: 12px; font-weight: 600; color: #f97316;
      cursor: pointer; text-decoration: none;
      &:hover { text-decoration: underline; }
    }
    @keyframes bellRing {
      0%,100%  { transform: rotate(0); }
      10%,30%  { transform: rotate(-10deg); }
      20%,40%  { transform: rotate(10deg); }
      50%      { transform: rotate(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NotificationBellComponent {
  open = signal(false);
  showCenter = signal(false);

  constructor(public ns: NotificationService) {}

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    const opening = !this.open();
    this.open.set(opening);
    if (opening) this.ns.loadAll();
  }

  openCenter(event: MouseEvent): void {
    event.stopPropagation();
    this.open.set(false);
    this.showCenter.set(true);
    this.ns.loadAll();
  }

  onNotifClick(n: any): void {
    if (!n.isRead) this.ns.markAsRead(n.notificationId);
  }

  trackByNotifId(index: number, n: any): number {
    return n.notificationId;
  }

  // Close when clicking outside
  @HostListener('document:click')
  onDocClick(): void {
    this.open.set(false);
  }

  stripEmojis(text: string): string {
    if (!text) return '';
    // Strip emojis, dingbats, and surrogate pairs
    return text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF]/g, '').trim();
  }

  getTypeIconHtml(type: string): string {
    const icons: Record<string, string> = {
      StatusUpdate:    '<i class="fa-solid fa-clipboard-list" style="color: #64748b;"></i>',
      Shortlisted:     '<i class="fa-solid fa-star" style="color: #eab308;"></i>',
      Interview:       '<i class="fa-regular fa-calendar-check" style="color: #3b82f6;"></i>',
      Offer:           '<i class="fa-solid fa-award" style="color: #003d4c;"></i>',
      Rejected:        '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>',
      AccountApproved: '<i class="fa-solid fa-circle-check" style="color: #003d4c;"></i>',
      AccountRejected: '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>',
      AccountBlocked:  '<i class="fa-solid fa-ban" style="color: #ef4444;"></i>',
      AccountActive:   '<i class="fa-solid fa-unlock-keyhole" style="color: #003d4c;"></i>',
      JobMatch:        '<i class="fa-solid fa-bullseye" style="color: #8b5cf6;"></i>'
    };
    return icons[type] || '<i class="fa-solid fa-bell" style="color: #003d4c;"></i>';
  }
}