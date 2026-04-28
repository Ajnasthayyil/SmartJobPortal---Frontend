import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { ApplicationTracking } from '../../../core/models/candidate.models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  applications = signal<ApplicationTracking[]>([]);
  filtered = signal<ApplicationTracking[]>([]);
  loading = signal(true);
  activeFilter = signal('All');

  readonly filters = [
    'All', 'Applied', 'UnderReview',
    'Shortlisted', 'Interview', 'Offered', 'Rejected'
  ];

  constructor(private service: CandidateService) { }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.service.getApplications().subscribe({
      next: res => {
        if (res.success) {
          this.applications.set(res.data || []);
          this.filtered.set(res.data || []);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(f: string): void {
    this.activeFilter.set(f);
    if (f === 'All') {
      this.filtered.set(this.applications());
    } else {
      this.filtered.set(
        this.applications().filter(a => a.status === f)
      );
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Applied: 'status-applied',
      UnderReview: 'status-review',
      Shortlisted: 'status-shortlisted',
      Interview: 'status-interview',
      Offered: 'status-offered',
      Rejected: 'status-rejected'
    };
    return map[status] || 'status-applied';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      Applied: 'Applied',
      UnderReview: 'Under Review',
      Shortlisted: 'Shortlisted ⭐',
      Interview: 'Interview Scheduled 📅',
      Offered: 'Offer Received 🎉',
      Rejected: 'Not Selected'
    };
    return map[status] || status;
  }

  countByStatus(status: string): number {
    if (status === 'All') return this.applications().length;
    return this.applications().filter(a => a.status === status).length;
  }
}