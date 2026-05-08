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
import { AdminCandidatesComponent } from './features/admin/candidates/admin-candidates.component';
import { AdminRecruitersComponent } from './features/admin/recruiters/admin-recruiters.component';
import { AdminJobsComponent } from './features/admin/jobs/admin-jobs.component';
import { JobsListComponent } from './features/jobs/jobs-list/jobs-list.component';
import { JobPublicDetailComponent } from './features/jobs/job-public-detail/job-public-detail.component';
import { CompaniesComponent } from './features/companies/companies.component';
import { JobSearchComponent } from './features/candidate/job-search/job-search.component';
import { ApplicationsComponent } from './features/candidate/applications/applications.component';
import { PostJobComponent } from './features/recruiter/post-job/post-job.component';
import { ManageJobsComponent } from './features/recruiter/manage-jobs/manage-jobs.component';
import { RecruiterProfileComponent } from './features/recruiter/profile/recruiter-profile.component';
import { ApplicantsComponent } from './features/recruiter/applicants/applicants.component';
import { JobDetailComponent } from './features/candidate/job-detail/job-detail.component';
import { SkillAnalysisComponent } from './features/candidate/skill-analysis/skill-analysis.component';
import { CoursesComponent } from './features/courses/courses.component';

// ✅ NEW COMPONENTS
import { ProfileAdminComponent } from './features/admin/profile-admin/profile-admin.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Public Pages (Accessible to everyone)
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'jobs', component: JobsListComponent },
  { path: 'jobs/:id', component: JobPublicDetailComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'courses', component: CoursesComponent },

  // Candidate Routes (Auth + Candidate Role required)
  { 
    path: 'candidate', 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Candidate'] },
    children: [
      { path: 'dashboard', component: CandidateDashboardComponent },
      { path: 'profile', component: CandidateProfileComponent },
      { path: 'jobs', component: JobSearchComponent },
      { path: 'jobs/:id', component: JobDetailComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'notifications', component: CandidateDashboardComponent },
      { path: 'settings', component: CandidateDashboardComponent },
      { path: 'skill-gap', component: SkillAnalysisComponent },
      { path: 'courses', component: CoursesComponent },
    ]
  },
  
  // Recruiter Routes (Auth + Recruiter Role required)
  {
    path: 'recruiter',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Recruiter'] },
    children: [
      { path: 'dashboard', component: RecruiterDashboardComponent },
      { path: 'post-job', component: PostJobComponent },
      { path: 'jobs', component: ManageJobsComponent },
      { path: 'applicants', component: ApplicantsComponent },
      { path: 'jobs/:id/applicants', component: ApplicantsComponent },
      { path: 'profile', component: RecruiterProfileComponent },
    ]
  },

  // Admin Routes (Auth + Admin Role required)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'candidates', component: AdminCandidatesComponent },
      { path: 'recruiters', component: AdminRecruitersComponent },
      { path: 'jobs', component: AdminJobsComponent },
      { path: 'profile', component: ProfileAdminComponent }, // ✅ CONNECTED!
    ]
  },

  { path: '**', component: NotFoundComponent } // ✅ CONNECTED!
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }