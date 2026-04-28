import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { MatchScoreResponse } from '../../../core/models/candidate.models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {

  job = signal<any>(null);
  matchScore = signal<MatchScoreResponse | null>(null);
  loading = signal(true);
  applying = signal(false);
  applied = signal(false);
  coverNote = '';
  showApply = signal(false);
  jobId = 0;

  constructor(
    private route: ActivatedRoute,
    private service: CandidateService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJob();
  }

  loadJob(): void {
    this.loading.set(true);
    this.service.getJobDetail(this.jobId).subscribe({
      next: res => {
        if (res.success) {
          this.job.set(res.data);
        }
        this.loading.set(false);
        this.loadMatchScore();
      },
      error: () => this.loading.set(false)
    });
  }

  loadMatchScore(): void {
    this.service.getMatchScore(this.jobId).subscribe({
      next: res => {
        if (res.success) this.matchScore.set(res.data);
      }
    });
  }

  applyJob(): void {
    this.applying.set(true);
    this.service.applyJob(this.jobId, this.coverNote).subscribe({
      next: res => {
        this.applying.set(false);
        if (res.success) {
          this.applied.set(true);
          this.showApply.set(false);
          this.toast.success('Application submitted successfully!');
        } else {
          this.toast.error(res.message || 'Failed to apply.');
        }
      },
      error: err => {
        this.applying.set(false);
        this.toast.error(err?.error?.message || 'Failed to apply.');
      }
    });
  }

  getScoreColor(score: number): string {
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getDashOffset(score: number): number {
    return 2 * Math.PI * 54 * (1 - score / 100);
  }
}