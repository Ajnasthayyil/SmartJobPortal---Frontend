import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApplicantResponse } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {

  applicants   = signal<ApplicantResponse[]>([]);
  loading      = signal(true);
  jobId        = 0;
  viewMode     = signal<'list' | 'ranked'>('ranked');
  updatingId   = signal<number | null>(null);
  
  searchQuery  = signal('');
  activeCategory = signal<'All' | 'New' | 'Screening' | 'Interview' | 'Shortlisted'>('All');

  readonly categories: ('All' | 'New' | 'Screening' | 'Interview' | 'Shortlisted')[] = 
    ['All', 'New', 'Screening', 'Interview', 'Shortlisted'];

  filtered = computed(() => {
    let list = this.applicants();
    
    // Category Filter
    if (this.activeCategory() !== 'All') {
      const cat = this.activeCategory();
      if (cat === 'New') {
        list = list.filter(a => a.status === 'Applied' || !a.status);
      } else if (cat === 'Screening') {
        list = list.filter(a => a.status === 'UnderReview');
      } else {
        list = list.filter(a => a.status === cat);
      }
    }

    // Search Filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(a => 
        (a.fullName || '').toLowerCase().includes(query) || 
        (a.jobTitle || '').toLowerCase().includes(query) ||
        (a.skills || []).some(s => s.toLowerCase().includes(query))
      );
    }

    return list;
  });

  constructor(
    private route:   ActivatedRoute,
    private service: RecruiterService,
    private toast:   ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.jobId = id ? Number(id) : 0;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    
    if (this.jobId > 0) {
      // 1. Fetch for specific Job
      const call = this.viewMode() === 'ranked'
        ? this.service.getRankedApplicants(this.jobId)
        : this.service.getApplicants(this.jobId);

      call.subscribe({
        next: res => {
          if (res.success) {
            let data = res.data || [];
            
            // Fix Resume URLs
            data = data.map(a => {
              if (a.hasResume && a.resumeUrl && a.resumeUrl.startsWith('/')) {
                a.resumeUrl = `${this.service.getApiBaseUrl()}${a.resumeUrl}`;
              }
              return a;
            });

            if (this.viewMode() === 'ranked' && data.length === 0) {
               // Fallback if AI ranking is empty
               this.viewMode.set('list');
               this.load();
               return;
            }
            this.applicants.set(data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      // 2. Fetch Global Applicants (Aggregated)
      this.service.getMyJobs().subscribe({
        next: jobRes => {
          if (jobRes.success && jobRes.data?.length) {
            const requests = jobRes.data.map(job => 
              this.service.getApplicants(job.jobId).pipe(
                map(res => {
                   // Inject JobTitle and fix Resume URLs
                   const applicants = res.data || [];
                   return applicants.map(a => {
                     const updated = { ...a, jobTitle: job.title };
                     if (updated.hasResume && updated.resumeUrl && updated.resumeUrl.startsWith('/')) {
                       updated.resumeUrl = `${this.service.getApiBaseUrl()}${updated.resumeUrl}`;
                     }
                     return updated;
                   });
                }),
                catchError(() => of([]))
              )
            );
            
            forkJoin(requests).subscribe(results => {
              const all = results.flat();
              this.applicants.set(all);
              this.loading.set(false);
            });
          } else {
            this.applicants.set([]);
            this.loading.set(false);
          }
        },
        error: () => this.loading.set(false)
      });
    }
  }

  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'ranked' ? 'list' : 'ranked');
    this.load();
  }

  onStatusChange(applicationId: number, event: any): void {
    const status = event.target.value;
    if (status) {
      this.updateStatus(applicationId, status);
    }
  }

  updateStatus(applicationId: number, status: string): void {
    this.updatingId.set(applicationId);
    
    // Ensure the payload matches the backend DTO property 'Status' (PascalCase or camelCase handled by JSON policy)
    this.service.updateStatus(applicationId, status).subscribe({
      next: res => {
        this.updatingId.set(null);
        if (res.success) {
          this.toast.success(`Status updated to ${status}`);
          this.applicants.update(list =>
            list.map(a =>
              a.applicationId === applicationId
                ? { ...a, status } : a
            )
          );
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.updatingId.set(null);
        const msg = err.error?.message || err.message || 'Server error';
        this.toast.error(`Update failed: ${msg}`);
      }
    });
  }

  isStatusAllowed(current: string, target: string): boolean {
    if (current === target) return true;
    if (target === 'Rejected') return true; // Can always reject

    const levels: Record<string, number> = {
      'Applied': 0,
      'UnderReview': 1,
      'Shortlisted': 2,
      'Interview': 3,
      'Offered': 4,
      'Rejected': 99
    };

    // Only allow moving forward in the lifecycle
    return (levels[target] || 0) > (levels[current] || 0);
  }

  getScoreColor(score: number | null): string {
    if (!score) return '#e2e8f0';
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  getDashOffset(score: number | null): number {
    const c = 2 * Math.PI * 22;
    return c * (1 - (score || 0) / 100);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}