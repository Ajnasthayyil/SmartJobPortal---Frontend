import { Component, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  styleUrls: ['./candidate-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  // Constants
  readonly ringCircumference      = 2 * Math.PI * 22;
  readonly ringCircumferenceLarge = 2 * Math.PI * 36;

  // Profile completion
  profileCompletion = signal(0);

  // Skill gaps — computed reactively from profile and jobs
  skillGaps = computed(() => {
    const profile = this.profile();
    const jobs    = this.recommendedJobs();
    
    if (!profile || !jobs.length) return [];

    const mySkills = profile.skills?.map(s => s.skillName.toLowerCase()) || [];
    const missingSkills = new Set<string>();

    jobs.slice(0, 3).forEach(job => {
      job.requiredSkills?.forEach(skill => {
        if (!mySkills.includes(skill.toLowerCase())) {
          missingSkills.add(skill);
        }
      });
    });

    return Array.from(missingSkills).slice(0, 6);
  });

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

    forkJoin({
      profile: this.candidateService.getProfile(),
      jobs: this.candidateService.searchJobs({ page: 1, pageSize: 5 }),
      applications: this.candidateService.getApplications()
    }).subscribe({
      next: ({ profile, jobs, applications }) => {
        // 1. Handle Profile
        if (profile.success) {
          this.profile.set(profile.data);
          this.calculateProfileCompletion(profile.data);
        }

        // 2. Handle Jobs
        if (jobs.success) {
          const jobData = jobs.data?.jobs || [];
          this.recommendedJobs.set(jobData);
          this.stats.update(s => ({ ...s, jobMatches: jobs.data?.totalCount || 0 }));
        }

        // 3. Handle Applications
        if (applications.success) {
          this.applications.set(applications.data || []);
          this.stats.update(s => ({ ...s, applications: applications.data?.length || 0 }));
        }

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error('Failed to load dashboard data.');
        console.error('Dashboard Load Error:', err);
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



  getScoreColor(score: number): string {
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getScoreDashOffset(score: number): number {
    return this.ringCircumference * (1 - score / 100);
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