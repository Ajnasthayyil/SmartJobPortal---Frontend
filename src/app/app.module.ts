import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtInterceptorService } from './core/interceptors/jwt-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ✅ Shared Components (Standalone)
import { FooterComponent } from './shared/components/footer/footer.component';
import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';
import { PublicNavbarComponent } from './shared/components/public-navbar/public-navbar.component';
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';

// ✅ Role-Specific Sidebars
import { CandidateSidebarComponent } from './features/candidate/candidate-sidebar/candidate-sidebar.component';
import { RecruiterSidebarComponent } from './features/recruiter/recruiter-sidebar/recruiter-sidebar.component';
import { AdminSidebarComponent } from './features/admin/admin-sidebar/admin-sidebar.component';

import { ShellVisibilityDirective } from './core/directives/shell-visibility.directive';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,

    // ✅ Shared Shell Components (Standalone)
    FooterComponent,
    DashboardHeaderComponent,
    CandidateSidebarComponent,
    RecruiterSidebarComponent,
    AdminSidebarComponent,
    PublicNavbarComponent,
    ToastContainerComponent,
    NotificationBellComponent, // ✅ Correctly imported as standalone
    ShellVisibilityDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }