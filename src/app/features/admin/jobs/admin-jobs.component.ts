import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

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

  constructor(
    private service: AdminService,
    private toast:   ToastService
  ) {}

  ngOnInit(): void { this.load(); }

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
    this.filtered.set(
      this.jobs().filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q)
      )
    );
  }

  deactivate(jobId: number): void {
    this.processing.set(jobId);
    this.service.deactivateJob(jobId).subscribe({
      next: res => {
        this.processing.set(null);
        if (res.success) {
          this.toast.success(res.data);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processing.set(null);
        this.toast.error('Failed to deactivate job.');
      }
    });
  }
}