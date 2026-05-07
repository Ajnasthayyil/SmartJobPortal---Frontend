import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileAdminComponent } from './features/admin/profile-admin/profile-admin.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

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

  // ── Candidate ──────────────────────────────────────────────
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
        path: 'jobs',
        loadComponent: () =>
          import('./features/candidate/job-search/candidate-job-search.component')
            .then(m => m.CandidateJobSearchComponent)
      },
      {
        path: 'job-detail/:id',
        loadComponent: () =>
          import('./features/candidate/job-detail/candidate-job-detail.component')
            .then(m => m.CandidateJobDetailComponent)
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/candidate/dashboard/candidate-dashboard.component') // Placeholder
            .then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/candidate/profile/candidate-profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/candidate/applications/candidate-applications.component')
            .then(m => m.CandidateApplicationsComponent)
      },
      {
        path: 'skill-gap',
        loadComponent: () =>
          import('./features/candidate/skill-analysis/candidate-skill-analysis.component')
            .then(m => m.CandidateSkillAnalysisComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Recruiter ──────────────────────────────────────────────
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
        path: 'jobs',
        loadComponent: () =>
          import('./features/recruiter/jobs/recruiter-jobs.component')
            .then(m => m.RecruiterJobsComponent)
      },
      {
        path: 'post-job',
        loadComponent: () =>
          import('./features/recruiter/jobs/recruiter-jobs.component') // Placeholder
            .then(m => m.RecruiterJobsComponent)
      },
      {
        path: 'applicants',
        loadComponent: () =>
          import('./features/recruiter/dashboard/recruiter-dashboard.component') // Placeholder
            .then(m => m.RecruiterDashboardComponent)
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
        component: ProfileAdminComponent
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
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];