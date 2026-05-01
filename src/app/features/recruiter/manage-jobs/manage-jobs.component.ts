import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponse } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.scss']
})
export class ManageJobsComponent implements OnInit {

  jobs       = signal<JobResponse[]>([]);
  filtered   = signal<JobResponse[]>([]);
  loading    = signal(true);
  activeTab  = signal<'all' | 'active' | 'inactive'>('all');
  confirmId  = signal<number | null>(null);

  constructor(
    private service: RecruiterService,
    private toast:   ToastService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.service.getMyJobs().subscribe({
      next: res => {
        if (res.success) {
          this.jobs.set(res.data || []);
          this.applyTab('all');
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyTab(tab: 'all' | 'active' | 'inactive'): void {
    this.activeTab.set(tab);
    const all = this.jobs();
    if (tab === 'active')   this.filtered.set(all.filter(j => j.isActive));
    else if (tab === 'inactive') this.filtered.set(all.filter(j => !j.isActive));
    else                    this.filtered.set(all);
  }

  count(tab: string): number {
    if (tab === 'active')   return this.jobs().filter(j => j.isActive).length;
    if (tab === 'inactive') return this.jobs().filter(j => !j.isActive).length;
    return this.jobs().length;
  }

  deleteJob(jobId: number): void {
    this.service.deleteJob(jobId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Job deactivated successfully.');
          this.confirmId.set(null);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      }
    });
  }

  toggleStatus(jobId: number): void {
    // Optimistic Update: Instantly flip UI state
    this.jobs.update(jobs => 
      jobs.map(j => j.jobId === jobId ? { ...j, isActive: !j.isActive } : j)
    );
    this.applyTab(this.activeTab()); // Re-apply current filter

    this.service.toggleJobStatus(jobId).subscribe({
      next: res => {
        if (!res.success) {
          // Revert on API reported failure
          this.toast.error(res.message);
          this.load(); 
        } else {
          this.toast.success('Job status updated instantly.');
        }
      },
      error: () => {
        // Revert on HTTP error
        this.toast.error('Failed to communicate with server. Reverting status.');
        this.load();
      }
    });
  }
}