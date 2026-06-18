import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  activeFilter = 'All';
  jobs: any[] = [];
  loading = true;

  filters = ['All', 'Full Time', 'Remote', 'Internship', 'Part Time', '₹0–₹20k', '₹20k–₹60k', '₹60k+'];

  stats = [
    { num: '48', suffix: 'K+', label: 'Live Jobs' },
    { num: '12', suffix: 'K+', label: 'Companies' },
    { num: '3.2', suffix: 'M+', label: 'Candidates' },
    { num: '94', suffix: '%', label: 'Placement Rate' },
  ];

  categories = [
    { icon: 'fa-solid fa-bezier-curve', name: 'UI/UX Designer', count: 2910, colorClass: 'purple' },
    { icon: 'fa-solid fa-palette', name: 'Graphic Designer', count: 1840, colorClass: 'yellow' },
    { icon: 'fa-solid fa-camera', name: 'Photography', count: 1250, colorClass: 'blue' },
    { icon: 'fa-solid fa-video', name: 'Videography', count: 980, colorClass: 'pink' },
    { icon: 'fa-solid fa-bullhorn', name: 'Marketing', count: 6720, colorClass: 'purple' },
    { icon: 'fa-solid fa-laptop-code', name: 'Software Dev', count: 12430, colorClass: 'blue' },
    { icon: 'fa-solid fa-sack-dollar', name: 'Finance', count: 3480, colorClass: 'yellow' },
    { icon: 'fa-solid fa-robot', name: 'AI & Learning', count: 2150, colorClass: 'pink' }
  ];

  displayCounts: number[] = [];
  private startTime: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchFeaturedJobs();
    this.categories.forEach((cat, i) => {
      this.displayCounts[i] = 0;
      this.animateCount(i, cat.count);
    });
  }

  fetchFeaturedJobs() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/candidate/jobs?page=1&pageSize=8`).subscribe({
      next: res => {
        if (res.success) {
          this.jobs = res.data?.jobs || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  animateCount(index: number, target: number) {
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!this.startTime) this.startTime = timestamp;
      const progress = Math.min((timestamp - this.startTime) / duration, 1);
      this.displayCounts[index] = Math.floor(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  companies = [
    { logoClass: 'logo-a', logoText: 'GG', name: 'Google', industry: 'Technology', openRoles: 142 },
    { logoClass: 'logo-b', logoText: 'AZ', name: 'Amazon', industry: 'E-Commerce & Cloud', openRoles: 89 },
    { logoClass: 'logo-e', logoText: 'RZ', name: 'Razorpay', industry: 'Fintech', openRoles: 34 },
    { logoClass: 'logo-c', logoText: 'SW', name: 'Swiggy', industry: 'Food Tech', openRoles: 57 },
  ];

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  get filteredJobs(): any[] {
    if (!this.jobs) return [];
    if (this.activeFilter === 'All') return this.jobs;
    
    const filter = this.activeFilter.toLowerCase();
    
    if (filter === 'full time') {
      return this.jobs.filter(j => j.jobType?.toLowerCase().includes('full') || j.jobType?.toLowerCase() === 'fulltime');
    }
    if (filter === 'remote') {
      return this.jobs.filter(j => 
        j.workMode?.toLowerCase().includes('remote') || 
        j.location?.toLowerCase().includes('remote') || 
        j.jobType?.toLowerCase().includes('remote')
      );
    }
    if (filter === 'internship') {
      return this.jobs.filter(j => j.jobType?.toLowerCase().includes('intern'));
    }
    if (filter === 'part time') {
      return this.jobs.filter(j => j.jobType?.toLowerCase().includes('part') || j.jobType?.toLowerCase() === 'parttime');
    }
    if (filter === '₹0–₹20k') {
      return this.jobs.filter(j => j.minSalary && j.minSalary <= 20000);
    }
    if (filter === '₹20k–₹60k') {
      return this.jobs.filter(j => j.minSalary && j.minSalary > 20000 && j.minSalary <= 60000);
    }
    if (filter === '₹60k+') {
      return this.jobs.filter(j => j.minSalary && j.minSalary > 60000);
    }
    
    return this.jobs;
  }
}