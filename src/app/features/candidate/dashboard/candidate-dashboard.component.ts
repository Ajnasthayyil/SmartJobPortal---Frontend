import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  CandidateProfile,
  JobListItem,
  ApplicationTracking,
  MatchScoreResponse
} from '../../../core/models/candidate.models';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.scss']
})
export class CandidateDashboardComponent implements OnInit {

  profile        = signal<CandidateProfile | null>(null);
  recommendedJobs = signal<JobListItem[]>([]);
  applications   = signal<ApplicationTracking[]>([]);
  loading        = signal(true);

  // Stats
  stats = signal({
    profileViews:   248,
    jobMatches:     0,
    applications:   0,
    savedJobs:      12
  });

  // Profile completion
  profileCompletion = signal(0);

  // Skill gaps — from top matched jobs
  skillGaps = signal<string[]>([]);

  constructor(
    private candidateService: CandidateService,
    public  authService:      AuthService,
    private toast:            ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);

    // Load profile
    this.candidateService.getProfile().subscribe({
      next: res => {
        if (res.success) {
          this.profile.set(res.data);
          this.calculateProfileCompletion(res.data);
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => this.toast.error('Failed to load profile.')
    });

    // Load recommended jobs
    this.candidateService.searchJobs({
      page: 1,
      pageSize: 5
    }).subscribe({
      next: res => {
        if (res.success) {
          const jobs = res.data?.jobs || [];
          this.recommendedJobs.set(jobs);
          this.stats.update(s => ({
            ...s, jobMatches: res.data?.totalCount || 0
          }));

          // Extract skill gaps from jobs
          this.extractSkillGaps(jobs);
        }
      },
      error: () => this.toast.error('Failed to load job recommendations.')
    });

    // Load applications
    this.candidateService.getApplications().subscribe({
      next: res => {
        if (res.success) {
          this.applications.set(res.data || []);
          this.stats.update(s => ({
            ...s, applications: res.data?.length || 0
          }));
        } else {
          this.toast.error(res.message);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load applications.');
      }
    });
  }

  calculateProfileCompletion(profile: CandidateProfile): void {
    let score = 0;
    if (profile.fullName)         score += 20;
    if (profile.headline)         score += 15;
    if (profile.summary)          score += 15;
    if (profile.location)         score += 10;
    if (profile.skills?.length)   score += 20;
    if (profile.hasResume)        score += 20;
    this.profileCompletion.set(score);
  }

  extractSkillGaps(jobs: JobListItem[]): void {
    const mySkills = this.profile()?.skills?.map(
      s => s.skillName.toLowerCase()
    ) || [];

    const missingSkills = new Set<string>();

    jobs.slice(0, 3).forEach(job => {
      job.requiredSkills?.forEach(skill => {
        if (!mySkills.includes(skill.toLowerCase())) {
          missingSkills.add(skill);
        }
      });
    });

    this.skillGaps.set(Array.from(missingSkills).slice(0, 6));
  }

  getScoreColor(score: number): string {
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getScoreDashOffset(score: number): number {
    const circumference = 2 * Math.PI * 22;
    return circumference * (1 - score / 100);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Applied':      'status-applied',
      'UnderReview':  'status-review',
      'Shortlisted':  'status-shortlisted',
      'Interview':    'status-interview',
      'Offered':      'status-offered',
      'Rejected':     'status-rejected'
    };
    return map[status] || 'status-applied';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'Applied':      'Applied',
      'UnderReview':  'Under Review',
      'Shortlisted':  'Shortlisted',
      'Interview':    'Interview Scheduled',
      'Offered':      'Offer Received 🎉',
      'Rejected':     'Not Selected'
    };
    return map[status] || status;
  }

  getUserFirstName(): string {
    return this.authService.currentUser()?.fullName?.split(' ')[0] || 'there';
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }
}