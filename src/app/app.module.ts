import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ✅ Shared Components (Standalone)
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';

// ✅ Directive (Standalone)
import { ShellVisibilityDirective } from './core/directives/shell-visibility.directive';

// ✅ Candidate (Standalone)
import { CandidateDashboardComponent } from './features/candidate/dashboard/candidate-dashboard.component';
import { CandidateProfileComponent } from './features/candidate/profile/candidate-profile.component';
import { JobSearchComponent } from './features/candidate/job-search/job-search.component';
import { JobDetailComponent } from './features/candidate/job-detail/job-detail.component';
import { ApplicationsComponent } from './features/candidate/applications/applications.component';

// ✅ Recruiter (Standalone)
import { RecruiterDashboardComponent } from './features/recruiter/dashboard/recruiter-dashboard.component';
import { PostJobComponent } from './features/recruiter/post-job/post-job.component';
import { ManageJobsComponent } from './features/recruiter/manage-jobs/manage-jobs.component';
import { ApplicantsComponent } from './features/recruiter/applicants/applicants.component';

// ✅ Admin (Standalone)
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin/users/admin-users.component';
import { AdminRecruitersComponent } from './features/admin/recruiters/admin-recruiters.component';
import { AdminJobsComponent } from './features/admin/jobs/admin-jobs.component';

@NgModule({
  declarations: [
    AppComponent
    // ❌ No other components here (since you're using standalone)
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,

    // ✅ Shared
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardHeaderComponent,
    ShellVisibilityDirective,

    // ✅ Candidate
    CandidateDashboardComponent,
    CandidateProfileComponent,
    JobSearchComponent,
    JobDetailComponent,
    ApplicationsComponent,

    // ✅ Recruiter
    RecruiterDashboardComponent,
    PostJobComponent,
    ManageJobsComponent,
    ApplicantsComponent,

    // ✅ Admin
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminRecruitersComponent,
    AdminJobsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }