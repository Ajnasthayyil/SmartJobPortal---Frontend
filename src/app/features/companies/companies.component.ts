import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  companies  = signal<any[]>([]);
  filtered   = signal<any[]>([]);
  loading    = signal(true);
  search     = '';
  selected   = signal<any | null>(null);

  readonly industries = [
    'All', 'Technology', 'Finance', 'Healthcare',
    'Retail', 'Manufacturing', 'Education'
  ];
  activeIndustry = 'All';

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    // Fetch all recruiters (companies) from admin endpoint
    // This is public-safe since it only shows company name/industry/location
    this.http.get<any>(`${environment.apiUrl}/recruiter/profile`)
      .subscribe({
        next: res => {
          // Fallback: build mock list from jobs endpoint
          this.http.get<any>(
            `${environment.apiUrl}/candidate/jobs?pageSize=100`
          ).subscribe({
            next: jobRes => {
              if (jobRes.success) {
                const jobs: any[] = jobRes.data?.jobs || [];
                const map = new Map<string, any>();
                jobs.forEach(j => {
                  if (!map.has(j.companyName)) {
                    map.set(j.companyName, {
                      companyName: j.companyName,
                      industry:    'Technology',
                      location:    j.location,
                      jobCount:    1,
                      jobs:        [j]
                    });
                  } else {
                    const c = map.get(j.companyName)!;
                    c.jobCount++;
                    c.jobs.push(j);
                  }
                });
                const list = Array.from(map.values());
                this.companies.set(list);
                this.filtered.set(list);
              }
              this.loading.set(false);
            },
            error: () => this.loading.set(false)
          });
        },
        error: () => {
          // Build from jobs directly
          this.http.get<any>(
            `${environment.apiUrl}/candidate/jobs?pageSize=100`
          ).subscribe({
            next: jobRes => {
              if (jobRes.success) {
                const jobs: any[] = jobRes.data?.jobs || [];
                const map = new Map<string, any>();
                jobs.forEach(j => {
                  if (!map.has(j.companyName)) {
                    map.set(j.companyName, {
                      companyName: j.companyName,
                      industry:    'Technology',
                      location:    j.location,
                      jobCount:    1,
                      jobs:        [j]
                    });
                  } else {
                    const c = map.get(j.companyName)!;
                    c.jobCount++;
                    c.jobs.push(j);
                  }
                });
                const list = Array.from(map.values());
                this.companies.set(list);
                this.filtered.set(list);
              }
              this.loading.set(false);
            },
            error: () => this.loading.set(false)
          });
        }
      });
  }

  applyFilter(): void {
    let list = this.companies();
    if (this.activeIndustry !== 'All')
      list = list.filter(c => c.industry === this.activeIndustry);
    if (this.search)
      list = list.filter(c =>
        c.companyName.toLowerCase().includes(this.search.toLowerCase())
      );
    this.filtered.set(list);
  }

  setIndustry(i: string): void {
    this.activeIndustry = i;
    this.applyFilter();
  }

  openCompany(c: any): void {
    this.selected.set(c);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeCompany(): void { this.selected.set(null); }
}