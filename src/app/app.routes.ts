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

  // ── Candidate routes ─────────────────────────────────
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Recruiter routes ──────────────────────────────────
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Admin routes ──────────────────────────────────────
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];