import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },

  // ── Candidate ─────────────────────────────────────────
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Candidate'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/candidate/dashboard/candidate-dashboard.component')
            .then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/candidate/profile/candidate-profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/candidate/job-search/job-search.component')
            .then(m => m.JobSearchComponent)
      },
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./features/candidate/job-detail/job-detail.component')
            .then(m => m.JobDetailComponent)
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/candidate/applications/applications.component')
            .then(m => m.ApplicationsComponent)
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/companies/companies.component')
            .then(m => m.CompaniesComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Recruiter ──────────────────────────────────────────
  {
    path: 'recruiter',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Recruiter'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/recruiter/dashboard/recruiter-dashboard.component')
            .then(m => m.RecruiterDashboardComponent)
      },
      {
        path: 'post-job',
        loadComponent: () =>
          import('./features/recruiter/post-job/post-job.component')
            .then(m => m.PostJobComponent)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/recruiter/manage-jobs/manage-jobs.component')
            .then(m => m.ManageJobsComponent)
      },
      {
        path: 'jobs/:id/applicants',
        loadComponent: () =>
          import('./features/recruiter/applicants/applicants.component')
            .then(m => m.ApplicantsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/recruiter/profile/recruiter-profile.component')
            .then(m => m.RecruiterProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Admin ──────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/admin-users.component')
            .then(m => m.AdminUsersComponent)
      },
      {
        path: 'recruiters',
        loadComponent: () =>
          import('./features/admin/recruiters/admin-recruiters.component')
            .then(m => m.AdminRecruitersComponent)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/admin/jobs/admin-jobs.component')
            .then(m => m.AdminJobsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile/admin-profile.component')
            .then(m => m.AdminProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'jobs',
    loadComponent: () =>
      import('./features/jobs/jobs-list/jobs-list.component')
        .then(m => m.JobsListComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./features/jobs/job-public-detail/job-public-detail.component')
        .then(m => m.JobPublicDetailComponent)
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./features/companies/companies.component')
        .then(m => m.CompaniesComponent)
  },

  { path: '**', redirectTo: '' }
];