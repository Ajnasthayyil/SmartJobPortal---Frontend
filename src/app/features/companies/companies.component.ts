import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../core/services/candidate.service';
import { ApiResponse } from '../../core/models/auth.models';

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

  constructor(
    private service: CandidateService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getCompanies().subscribe({
      next: (res: ApiResponse<any[]>) => {
        if (res.success && res.data && res.data.length > 0) {
          this.companies.set(res.data.map((c: any) => ({
            ...c,
            name: c.companyName, // Mapping for template
            id: c.recruiterId
          })));
          this.loading.set(false);
        } else {
          this.loadFromJobs();
        }
      },
      error: () => this.loadFromJobs()
    });
  }

  private loadFromJobs(): void {
    this.service.searchJobs({ pageSize: 100 }).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.success) {
          const jobs: any[] = res.data?.jobs || [];
          const map = new Map<string, any>();
          
          jobs.forEach(j => {
            if (!map.has(j.companyName)) {
              map.set(j.companyName, {
                id: j.jobId,
                name: j.companyName,
                industry: j.industry || 'Business',
                location: j.location,
                openJobsCount: 1,
                size: j.companySize || '', // Empty if not provided
                description: j.companyDescription || '',
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
  }

  setIndustry(i: string): void {
    this.activeIndustry = i;
  }

  getFilteredCompanies(): any[] {
    let list = this.companies();
    
    if (this.activeIndustry !== 'All') {
      list = list.filter(c => c.industry === this.activeIndustry);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(term) || 
        (c.industry && c.industry.toLowerCase().includes(term))
      );
    }
    
    return list;
  }
}