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

  companies = signal<any[]>([]);
  loading = signal(true);
  searchTerm = '';
  activeIndustry = 'All';

  readonly industries = [
    'All', 'Technology', 'Fintech', 'Healthcare',
    'Retail', 'Manufacturing', 'Education'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    // Fetch jobs and extract company info since recruiters profiles might be protected/empty
    this.http.get<any>(`${environment.apiUrl}/candidate/jobs?pageSize=100`)
      .subscribe({
        next: res => {
          if (res.success) {
            const jobs: any[] = res.data?.jobs || [];
            const map = new Map<string, any>();
            
            jobs.forEach(j => {
              if (!map.has(j.companyName)) {
                map.set(j.companyName, {
                  id: j.jobId, // Fallback ID
                  name: j.companyName,
                  industry: 'Technology', // Default
                  location: j.location,
                  openJobsCount: 1,
                  size: '50-200',
                  recentJobs: [{ title: j.title }]
                });
              } else {
                const c = map.get(j.companyName)!;
                c.openJobsCount++;
                if (c.recentJobs.length < 2) {
                  c.recentJobs.push({ title: j.title });
                }
              }
            });
            
            this.companies.set(Array.from(map.values()));
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onSearch(): void {
    // Search is handled by filtering the displayed signal or a separate derived signal
    // For simplicity, we just trigger the signal logic if needed
  }

  setIndustry(i: string): void {
    this.activeIndustry = i;
  }

  // Helper to get filtered companies for the template
  getFilteredCompanies(): any[] {
    let list = this.companies();
    
    if (this.activeIndustry !== 'All') {
      list = list.filter(c => c.industry === this.activeIndustry);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.industry.toLowerCase().includes(term)
      );
    }
    
    return list;
  }
}