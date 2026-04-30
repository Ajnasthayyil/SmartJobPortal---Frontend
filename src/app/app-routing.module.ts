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
import { JobsListComponent } from './features/jobs/jobs-list/jobs-list.component';
import { JobPublicDetailComponent } from './features/jobs/job-public-detail/job-public-detail.component';
import { CompaniesComponent } from './features/companies/companies.component';
import { JobSearchComponent } from './features/candidate/job-search/job-search.component';
import { ApplicationsComponent } from './features/candidate/applications/applications.component';
import { PostJobComponent } from './features/recruiter/post-job/post-job.component';
import { ManageJobsComponent } from './features/recruiter/manage-jobs/manage-jobs.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'candidate/dashboard', component: CandidateDashboardComponent },
  { path: 'candidate/profile', component: CandidateProfileComponent },
  { path: 'candidate/jobs', component: JobSearchComponent },
  { path: 'candidate/applications', component: ApplicationsComponent },
  { path: 'candidate/companies', component: CompaniesComponent },
  { path: 'candidate/notifications', component: CandidateDashboardComponent }, // Fallback
  { path: 'candidate/settings', component: CandidateDashboardComponent },      // Fallback
  { path: 'candidate/skill-gap', component: CandidateDashboardComponent },     // Fallback
  
  { path: 'recruiter/dashboard', component: RecruiterDashboardComponent },
  { path: 'recruiter/post-job', component: PostJobComponent },
  { path: 'recruiter/jobs', component: ManageJobsComponent },
  { path: 'recruiter/profile', component: CandidateProfileComponent }, // Reusing profile for now

  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/recruiters', component: AdminRecruitersComponent },
  { path: 'admin/jobs', component: AdminJobsComponent },
  
  // Public Pages
  { path: 'jobs', component: JobsListComponent },
  { path: 'jobs/:id', component: JobPublicDetailComponent },
  { path: 'companies', component: CompaniesComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }