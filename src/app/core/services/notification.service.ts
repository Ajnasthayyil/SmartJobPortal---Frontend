import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  private pollInterval: any;

  constructor(private http: HttpClient) {}

  // Start polling when user logs in
  startPolling(): void {
    this.fetchUnreadCount();
    // Poll every 30 seconds
    this.pollInterval = setInterval(
      () => this.fetchUnreadCount(), 30_000
    );
  }

  // Stop polling on logout
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
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