import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApplicantResponse } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {

  applicants   = signal<ApplicantResponse[]>([]);
  loading      = signal(true);
  jobId        = 0;
  viewMode     = signal<'list' | 'ranked'>('ranked');
  updatingId   = signal<number | null>(null);
  activeTab    = signal<'all' | 'shortlisted'>('all');

  filtered = signal<ApplicantResponse[]>([]);

  readonly statuses = [
    'UnderReview', 'Shortlisted', 'Interview', 'Offered', 'Rejected'
  ];

  constructor(
    private route:   ActivatedRoute,
    private service: RecruiterService,
    private toast:   ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.jobId = idParam ? Number(idParam) : 0;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    let call;

    if (this.jobId > 0) {
      call = this.viewMode() === 'ranked'
        ? this.service.getRankedApplicants(this.jobId)
        : this.service.getApplicants(this.jobId);
    } else {
      // Global applicants across all jobs
      call = this.service.getApplicantsAcrossAllJobs();
    }

    call.subscribe({
      next: res => {
        if (res.success) {
          this.applicants.set(res.data || []);
          this.updateFiltered();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateFiltered(): void {
    const all = this.applicants();
    if (this.activeTab() === 'shortlisted') {
      this.filtered.set(all.filter(a => a.status === 'Shortlisted'));
    } else {
      this.filtered.set(all);
    }
  }

  // Hook tab changes
  onTabChange(tab: 'all' | 'shortlisted'): void {
    this.activeTab.set(tab);
    this.updateFiltered();
  }

  toggleMode(): void {
    this.viewMode.update(m => m === 'ranked' ? 'list' : 'ranked');
    this.load();
  }

  updateStatus(applicationId: number, status: string): void {
    this.updatingId.set(applicationId);
    this.service.updateStatus(applicationId, status).subscribe({
      next: res => {
        this.updatingId.set(null);
        if (res.success) {
          this.toast.success(`Status updated to "${status}"`);
          this.applicants.update(list =>
            list.map(a =>
              a.applicationId === applicationId
                ? { ...a, status } : a
            )
          );
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.updatingId.set(null);
        this.toast.error('Failed to update status.');
      }
    });
  }

  getScoreColor(score: number | null): string {
    if (!score) return '#e5e7eb';
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getDashOffset(score: number | null): number {
    const c = 2 * Math.PI * 22;
    return c * (1 - (score || 0) / 100);
  }

  getStatusClass(s: string): string {
    const m: Record<string, string> = {
      Applied: 'st-applied', UnderReview: 'st-review',
      Shortlisted: 'st-short', Interview: 'st-interview',
      Offered: 'st-offered', Rejected: 'st-rejected'
    };
    return m[s] || 'st-applied';
  }
}