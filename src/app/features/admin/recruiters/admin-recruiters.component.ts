import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { RecruiterApproval } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-recruiters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-recruiters.component.html',
  styleUrls: ['./admin-recruiters.component.scss']
})
export class AdminRecruitersComponent implements OnInit {

  recruiters   = signal<RecruiterApproval[]>([]);
  loading      = signal(true);
  processingId = signal<number | null>(null);
  activeTab    = signal<'pending' | 'all'>('pending');

  constructor(
    private service: AdminService,
    private toast:   ToastService
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
      this.service.getUsers('Recruiter').subscribe({
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

  switchTab(tab: 'pending' | 'all'): void {
    this.activeTab.set(tab);
    this.load();
  }
}