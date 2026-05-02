import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponse, ApplicantResponse } from '../../../core/models/recruiter.models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit {

  jobs            = signal<JobResponse[]>([]);
  topApplicants   = signal<ApplicantResponse[]>([]);
  loading         = signal(true);

  stats = signal({
    activeJobs:     0,
    totalApplicants: 0,
    avgMatchScore:  0,
    hiresThisMonth: 3
  });

  private activityChart?: Chart;
  private statusChart?: Chart;

  constructor(
    private recruiterService: RecruiterService,
    public  authService:      AuthService,
    private toast:            ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    this.initActivityChart();
    this.initStatusChart();
  }

  private initActivityChart(): void {
    const ctx = document.getElementById('activityChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.activityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Applicants',
          data: [40, 55, 68, 85, 92, 110],
          backgroundColor: '#10b981',
          borderRadius: 8,
          barThickness: 32
        }, {
          label: 'Hires',
          data: [5, 7, 9, 12, 10, 15],
          backgroundColor: '#6366f1',
          borderRadius: 8,
          barThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Inter', weight: 600 } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { 
            beginAtZero: true,
            grid: { color: '#f1f5f9' }
          }
        }
      }
    });
  }

  private initStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New', 'Interview', 'Shortlisted', 'Rejected'],
        datasets: [{
          data: [120, 32, 28, 45],
          backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f43f5e'],
          borderWidth: 0,
          hoverOffset: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { padding: 20, usePointStyle: true, font: { family: 'Inter', weight: 600 } }
          }
        }
      }
    });
  }

  loadDashboard(): void {
    this.loading.set(true);

    this.recruiterService.getMyJobs().subscribe({
      next: res => {
        if (res.success) {
          const jobs = res.data || [];
          this.jobs.set(jobs);

          const active = jobs.filter(j => j.isActive).length;
          const total  = jobs.reduce((s, j) => s + j.totalApplicants, 0);

          this.stats.update(s => ({
            ...s,
            activeJobs:      active,
            totalApplicants: total
          }));

          // Load top applicants for the first active job
          const firstJob = jobs.find(j => j.isActive);
          if (firstJob) {
            this.loadTopApplicants(firstJob.jobId);
          } else {
            this.loading.set(false);
          }
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  loadTopApplicants(jobId: number): void {
    this.recruiterService.getRankedApplicants(jobId).subscribe({
      next: res => {
        if (res.success) {
          this.topApplicants.set((res.data || []).slice(0, 5));

          const scores = (res.data || [])
            .filter(a => a.totalScore != null)
            .map(a => a.totalScore!);

          if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            this.stats.update(s => ({
              ...s, avgMatchScore: Math.round(avg)
            }));
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getScoreColor(score: number | null): string {
    if (!score) return '#e5e7eb';
    if (score >= 70) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  getScoreDashOffset(score: number | null): number {
    const r = 22;
    const circumference = 2 * Math.PI * r;
    return circumference * (1 - (score || 0) / 100);
  }

  getScoreLabel(score: number | null): string {
    if (!score) return 'N/A';
    if (score >= 70) return '🔥 Strong';
    if (score >= 40) return '⚡ Partial';
    return 'Low';
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

  deleteJob(jobId: number): void {
    this.recruiterService.deleteJob(jobId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Job deactivated.');
          this.loadDashboard();
        }
      }
    });
  }
}