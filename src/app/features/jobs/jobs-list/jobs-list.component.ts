import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent implements OnInit {

  jobs       = signal<any[]>([]);
  loading    = signal(true);
  totalCount = signal(0);
  page       = signal(1);
  pageSize   = 12;

  keyword    = '';
  location   = '';
  jobType    = '';
  activeFilter = 'All';
  selectedSalary: any = null;

  readonly jobTypes = [
    'All', 'Full Time', 'Remote', 'Internship', 'Part Time'
  ];
  readonly salaryRanges = [
    { label: '₹0–₹20k',  min: 0,     max: 20000  },
    { label: '₹20k–₹60k',min: 20000, max: 60000  },
    { label: '₹60k+',    min: 60000, max: null    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.search(); }

  search(): void {
    this.loading.set(true);
    this.page.set(1);

    let params = new HttpParams()
      .set('page', 1)
      .set('pageSize', this.pageSize);

    if (this.keyword)  params = params.set('keyword', this.keyword);
    if (this.location) params = params.set('location', this.location);
    if (this.jobType && this.jobType !== 'All')
      params = params.set('jobType', this.jobType.replace(' ', ''));
    if (this.selectedSalary?.min != null)
      params = params.set('minSalary', this.selectedSalary.min);
    if (this.selectedSalary?.max != null)
      params = params.set('maxSalary', this.selectedSalary.max);

    this.http.get<any>(
      `${environment.apiUrl}/candidate/jobs`, { params }
    ).subscribe({
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

  setFilter(f: string): void {
    this.activeFilter = f;
    this.jobType = f === 'All' ? '' : f.replace(' ', '');
    this.search();
  }

  setSalary(r: any): void {
    this.selectedSalary =
      this.selectedSalary?.label === r.label ? null : r;
    this.search();
  }

  loadMore(): void {
    this.page.update(p => p + 1);
    let params = new HttpParams()
      .set('page', this.page())
      .set('pageSize', this.pageSize);
    if (this.keyword) params = params.set('keyword', this.keyword);

    this.http.get<any>(
      `${environment.apiUrl}/candidate/jobs`, { params }
    ).subscribe({
      next: res => {
        if (res.success)
          this.jobs.update(j => [...j, ...(res.data?.jobs || [])]);
      }
    });
  }

  get hasMore(): boolean {
    return this.jobs().length < this.totalCount();
  }
}