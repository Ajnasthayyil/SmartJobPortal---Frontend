import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './features/landing/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { CandidateDashboardComponent } from './features/candidate/dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './features/recruiter/dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { CandidateProfileComponent } from './features/candidate/profile/candidate-profile.component';
import { AdminUsersComponent } from './features/admin/users/admin-users.component';
import { AdminRecruitersComponent } from './features/admin/recruiters/admin-recruiters.component';
import { AdminJobsComponent } from './features/admin/jobs/admin-jobs.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'candidate/dashboard', component: CandidateDashboardComponent },
  { path: 'candidate/profile', component: CandidateProfileComponent },
  { path: 'recruiter/dashboard', component: RecruiterDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/recruiters', component: AdminRecruitersComponent },
  { path: 'admin/jobs', component: AdminJobsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }