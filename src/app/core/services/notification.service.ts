import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SignalrService } from './signalr.service';
import { ToastService } from './toast.service';


export interface Notification {
  notificationId: number;
  title:          string;
  message:        string;
  type:           string;
  isRead:         boolean;
  createdAt:      string;
  timeAgo:        string;
  jobTitle?:      string;
  companyName?:   string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly api = `${environment.apiUrl}/notification`;

  unreadCount  = signal(0);
  notifications = signal<Notification[]>([]);

  constructor(
    private http: HttpClient,
    private signalr: SignalrService,
    private toast: ToastService
  ) {
    this.signalr.notificationReceived$.subscribe(data => {
      this.handleIncomingNotification(data);
    });
  }

  private handleIncomingNotification(data: any): void {
    if (data && data.title) {
      data.title = data.title.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF]/g, '').trim();
    }
    // Add to top of notifications list
    this.notifications.update(list => [data, ...list]);
    // Increment unread count
    this.unreadCount.update(c => c + 1);
    // Show toast
    this.toast.info(`${data.title}: ${data.message}`);
  }


  // Start SignalR connection (called on login)
  startRealTime(token: string): void {
    this.fetchUnreadCount();
    this.signalr.startConnection(token);
  }

  // Stop SignalR connection (called on logout)
  stopRealTime(): void {
    this.signalr.stopConnection();
    this.unreadCount.set(0);
    this.notifications.set([]);
  }


  fetchUnreadCount(): void {
    this.http.get<any>(`${this.api}/unread-count`)
      .subscribe({
        next: res => {
          if (res.success)
            this.unreadCount.set(res.data?.count || 0);
        },
        error: () => {} // Silent fail
      });
  }

  loadAll(): void {
    this.http.get<any>(this.api).subscribe({
      next: res => {
        if (res.success)
          this.notifications.set(res.data || []);
      }
    });
  }

  markAsRead(id: number): void {
    this.http.put<any>(`${this.api}/${id}/read`, {})
      .subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(n =>
              n.notificationId === id
                ? { ...n, isRead: true }
                : n
            )
          );
          this.unreadCount.update(c => Math.max(0, c - 1));
        }
      });
  }

  markAllAsRead(): void {
    this.http.put<any>(`${this.api}/read-all`, {})
      .subscribe({
        next: () => {
          this.notifications.update(list =>
            list.map(n => ({ ...n, isRead: true }))
          );
          this.unreadCount.set(0);
        }
      });
  }

  sendNotification(targetUserId: number, title: string, message: string) {
    return this.http.post<any>(`${this.api}/send`, { targetUserId, title, message });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      StatusUpdate:    '📋',
      Shortlisted:     '⭐',
      Interview:       '📅',
      Offer:           '🎊',
      Rejected:        '📭',
      AccountApproved: '✅',
      AccountRejected: '❌',
      AccountBlocked:  '🚫',
      AccountActive:   '🔓',
      JobMatch:        '🎯'
    };
    return icons[type] || '🔔';
  }
}