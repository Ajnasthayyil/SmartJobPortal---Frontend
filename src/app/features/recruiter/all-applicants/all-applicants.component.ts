import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-applicants',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="empty-state">
        <i class="fa-solid fa-users" style="font-size: 48px; color: #cbd5e1; margin-bottom: 24px;"></i>
        <h1>All Applicants</h1>
        <p>To view applicants, please select a specific job listing from the Manage Jobs page.</p>
        <br>
        <a routerLink="/recruiter/jobs" class="btn-primary">Go to Manage Jobs</a>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 140px 32px 60px;
      font-family: 'Inter', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
    .empty-state {
      text-align: center;
      background: white;
      padding: 60px;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid #f1f5f9;
      max-width: 500px;
    }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; margin-bottom: 16px; font-size: 24px; }
    p { color: #64748b; line-height: 1.5; }
    .btn-primary {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.2s;
    }
    .btn-primary:hover { background: #059669; }
  `]
})
export class AllApplicantsComponent {}
