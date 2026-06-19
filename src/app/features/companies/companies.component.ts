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
  currentPage = signal(1);
  pageSize = 8;
  searchTerm = '';
  activeIndustry = 'All';

  // Modal State
  selectedCompany: any = null;
  showModal = false;

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

  openCompanyModal(co: any): void {
    this.selectedCompany = co;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCompanyModal(): void {
    this.showModal = false;
    this.selectedCompany = null;
    document.body.style.overflow = 'auto';
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
    this.currentPage.set(1);
  }

  private get allFiltered(): any[] {
    let list = this.companies();
    
    if (this.activeIndustry !== 'All') {
      const active = this.activeIndustry.toLowerCase();
      list = list.filter(c => {
        if (!c.industry) return false;
        const ind = c.industry.toLowerCase().trim();
        
        if (active === 'technology') {
          return ind.includes('tech') || ind === 'it' || ind.includes('software');
        }
        if (active === 'education') {
          return ind.includes('educat') || ind.includes('school') || ind.includes('training') || ind.includes('academy');
        }
        if (active === 'retail') {
          return ind.includes('retail') || ind.includes('food') || ind.includes('market') || ind.includes('store') || ind.includes('shop');
        }
        if (active === 'fintech') {
          return ind.includes('fin') || ind.includes('bank') || ind.includes('pay');
        }
        if (active === 'healthcare') {
          return ind.includes('health') || ind.includes('medic') || ind.includes('hospit');
        }
        if (active === 'manufacturing') {
          return ind.includes('manufactur') || ind.includes('factor') || ind.includes('industr');
        }
        
        return ind === active;
      });
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(term)) || 
        (c.industry && c.industry.toLowerCase().includes(term)) ||
        (c.location && c.location.toLowerCase().includes(term))
      );
    }
    
    return list;
  }

  get paginatedCompanies(): any[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allFiltered.slice(start, start + this.pageSize);
  }

  get totalFilteredCount(): number {
    return this.allFiltered.length;
  }

  get totalPages(): number {
    return Math.ceil(this.allFiltered.length / this.pageSize);
  }

  changePage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.currentPage.set(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeIndustry = 'All';
    this.currentPage.set(1);
  }

  setIndustry(i: string): void {
    this.activeIndustry = i;
    this.currentPage.set(1);
  }

  getFilteredCompanies(): any[] {
    return this.allFiltered;
  }
}