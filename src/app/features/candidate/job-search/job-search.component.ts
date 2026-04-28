import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobListItem } from '../../../core/models/candidate.models';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit {

  jobs = signal<JobListItem[]>([]);
  loading = signal(true);
  totalCount = signal(0);
  page = signal(1);
  pageSize = 12;

  // Filters
  keyword = '';
  location = '';
  jobType = '';
  activeFilter = 'All';

  readonly jobTypes = ['All', 'FullTime', 'PartTime', 'Remote', 'Internship', 'Contract'];
  readonly salaryRanges = [
    { label: '₹0–₹20k', min: 0, max: 20000 },
    { label: '₹20–₹60k', min: 20000, max: 60000 },
    { label: '₹60k+', min: 60000, max: null }
  ];
  selectedSalary: any = null;

  constructor(
    private service: CandidateService,
    private toast: ToastService
  ) { }

  ngOnInit(): void { this.search(); }

  search(): void {
    this.loading.set(true);
    this.page.set(1);
    this.service.searchJobs(this.buildParams()).subscribe({
      next: res => {
        if (res.success) {
          this.jobs.set(res.data?.jobs || []);
          this.totalCount.set(res.data?.totalCount || 0);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    if (filter === 'All') {
      this.jobType = '';
    } else if (['FullTime', 'PartTime', 'Remote', 'Internship', 'Contract'].includes(filter)) {
      this.jobType = filter;
    }
    this.search();
  }

  setSalary(range: any): void {
    this.selectedSalary = range;
    this.search();
  }

  loadMore(): void {
    this.page.update(p => p + 1);
    this.service.searchJobs({ ...this.buildParams(), page: this.page() }).subscribe({
      next: res => {
        if (res.success) {
          this.jobs.update(j => [...j, ...(res.data?.jobs || [])]);
        }
      }
    });
  }

  buildParams(): any {
    return {
      keyword: this.keyword || undefined,
      location: this.location || undefined,
      jobType: this.jobType || undefined,
      minSalary: this.selectedSalary?.min,
      maxSalary: this.selectedSalary?.max,
      page: this.page(),
      pageSize: this.pageSize
    };
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize);
  }

  getScoreColor(score: number | null): string {
    if (!score) return '#e5e7eb';
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getDashOffset(score: number | null): number {
    const c = 2 * Math.PI * 18;
    return c * (1 - (score || 0) / 100);
  }
}