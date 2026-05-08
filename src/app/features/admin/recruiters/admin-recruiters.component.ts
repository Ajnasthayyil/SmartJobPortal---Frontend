import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { RecruiterApproval } from '../../../core/models/admin.models';
import { NotificationService } from '../../../core/services/notification.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-recruiters',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './admin-recruiters.component.html',
  styleUrls: ['./admin-recruiters.component.scss']
})
export class AdminRecruitersComponent implements OnInit {

  recruiters   = signal<RecruiterApproval[]>([]);
  loading      = signal(true);
  processingId = signal<number | null>(null);
  activeTab    = signal<'pending' | 'all'>('pending');

  // Notification State
  notificationModalOpen = signal(false);
  notifyingRecruiter = signal<RecruiterApproval | null>(null);
  notificationForm = { title: '', message: '' };
  sendingNotification = signal(false);
  
  // Details Modal State
  detailsModalOpen = signal(false);
  selectedRecruiter = signal<RecruiterApproval | null>(null);


  constructor(
    private service: AdminService,
    private toast:   ToastService,
    private notify:  NotificationService
  ) {}


  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    if (this.activeTab() === 'pending') {
      this.service.getPendingRecruiters().subscribe({
        next: (res: any) => {
          if (res.success) this.recruiters.set(res.data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.service.getAllRecruiters().subscribe({
        next: (res: any) => {
          if (res.success) this.recruiters.set(res.data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  approve(userId: number): void {
    this.processingId.set(userId);
    this.service.approveRecruiter(userId).subscribe({
      next: res => {
        this.processingId.set(null);
        if (res.success) {
          this.toast.success(res.data);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processingId.set(null);
        this.toast.error('Approval failed.');
      }
    });
  }

  reject(userId: number): void {
    this.processingId.set(userId);
    this.service.rejectRecruiter(userId).subscribe({
      next: res => {
        this.processingId.set(null);
        if (res.success) {
          this.toast.success(res.data);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processingId.set(null);
        this.toast.error('Rejection failed.');
      }
    });
  }

  block(userId: number): void {
    this.processingId.set(userId);
    this.service.blockUser(userId).subscribe({
      next: res => {
        this.processingId.set(null);
        if (res.success) {
          this.toast.success('Recruiter blocked successfully.');
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processingId.set(null);
        this.toast.error('Failed to block recruiter.');
      }
    });
  }

  unblock(userId: number): void {
    this.processingId.set(userId);
    this.service.unblockUser(userId).subscribe({
      next: res => {
        this.processingId.set(null);
        if (res.success) {
          this.toast.success('Recruiter unblocked successfully.');
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processingId.set(null);
        this.toast.error('Failed to unblock recruiter.');
      }
    });
  }

  switchTab(tab: 'pending' | 'all'): void {
    this.activeTab.set(tab);
    this.load();
  }

  // ── Custom Notification Logic ─────────────────────────────────

  openNotificationModal(r: RecruiterApproval): void {
    this.notifyingRecruiter.set(r);
    this.notificationForm = { 
      title: 'Message from Administrator', 
      message: `Hi ${r.fullName.split(' ')[0]}, ` 
    };
    this.notificationModalOpen.set(true);
  }

  closeNotificationModal(): void {
    this.notificationModalOpen.set(false);
    this.notifyingRecruiter.set(null);
  }

  sendCustomNotification(): void {
    const r = this.notifyingRecruiter();
    if (!r) return;

    if (!this.notificationForm.title || !this.notificationForm.message) {
      this.toast.warning('Please fill in both title and message.');
      return;
    }

    this.sendingNotification.set(true);
    this.notify.sendNotification(r.userId, this.notificationForm.title, this.notificationForm.message)
      .subscribe({
        next: res => {
          this.sendingNotification.set(false);
          if (res.success) {
            this.toast.success('Notification sent to recruiter.');
            this.closeNotificationModal();
          } else {
            this.toast.error(res.message);
          }
        },
        error: () => {
          this.sendingNotification.set(false);
          this.toast.error('Failed to send notification.');
        }
      });
  }

  // ── Details Modal Logic ──────────────────────────────────────
  
  openDetailsModal(r: RecruiterApproval): void {
    this.selectedRecruiter.set(r);
    this.detailsModalOpen.set(true);
  }

  closeDetailsModal(): void {
    this.detailsModalOpen.set(false);
    this.selectedRecruiter.set(null);
  }
}