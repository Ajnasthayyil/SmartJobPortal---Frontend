import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.scss']
})
export class AdminJobsComponent implements OnInit {

  jobs       = signal<any[]>([]);
  filtered   = signal<any[]>([]);
  loading    = signal(true);
  processing = signal<number | null>(null);
  search     = '';
  sortActiveFirst = true;
  activeCount = signal(0);

  constructor(
    private service: AdminService,
    private toast:   ToastService,
    private route:   ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) {
        this.search = params['keyword'];
      } else {
        this.search = '';
      }
      this.applySearch();
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAllJobs().subscribe({
      next: res => {
        if (res.success) {
          this.jobs.set(res.data || []);
          this.applySearch();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applySearch(): void {
    const q = this.search.toLowerCase();
    let results = this.jobs().filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q)
    );

    // Calculate active (unblocked) count among filtered results
    this.activeCount.set(results.filter(j => !j.isAdminBlocked).length);

    // Apply sorting (Unblocked first)
    results = results.sort((a, b) => {
      if (this.sortActiveFirst) {
        return (a.isAdminBlocked === b.isAdminBlocked) ? 0 : a.isAdminBlocked ? 1 : -1;
      } else {
        return (a.isAdminBlocked === b.isAdminBlocked) ? 0 : a.isAdminBlocked ? -1 : 1;
      }
    });

    this.filtered.set(results);
  }

  toggleSort(): void {
    this.sortActiveFirst = !this.sortActiveFirst;
    this.applySearch();
  }

  toggleStatus(jobId: number): void {
    const job = this.jobs().find(j => j.jobId === jobId);
    const isBlocking = !job?.isAdminBlocked; // If not blocked, we are about to block it

    this.processing.set(jobId);
    this.service.toggleJobStatus(jobId).subscribe({
      next: res => {
        this.processing.set(null);
        if (res.success) {
          const msg = isBlocking ? 'Job successfully blocked' : 'Job successfully unblocked';
          this.toast.success(msg);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processing.set(null);
        this.toast.error('Failed to update job status.');
      }
    });
  }
}