import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PublicNavbarComponent } from './shared/components/public-navbar/public-navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  template: `
    <!-- Dashboard Header -->
    <ng-container *ngIf="isAuthPage()">
      <app-dashboard-header></app-dashboard-header>
    </ng-container>

    <!-- Public Navbar -->
    <ng-container *ngIf="isPublicPage()">
      <app-public-navbar></app-public-navbar>
    </ng-container>

    <!-- Sidebar -->
    <ng-container *ngIf="showSidebar()">
      <app-sidebar></app-sidebar>
    </ng-container>

    <!-- Main Content -->
    <main [class.has-sidebar]="showSidebar()">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <ng-container *ngIf="isPublicPage()">
      <app-footer></app-footer>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {}

  showSidebar(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/candidate') ||
      url.startsWith('/recruiter') ||
      url.startsWith('/admin')
    );
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/candidate') ||
      url.startsWith('/recruiter') ||
      url.startsWith('/admin')
    );
  }

  isPublicPage(): boolean {
    const url = this.router.url;

    return !(
      url.startsWith('/login') ||
      url.startsWith('/register') ||
      url.startsWith('/forgot-password') ||
      url.startsWith('/candidate') ||
      url.startsWith('/recruiter') ||
      url.startsWith('/admin')
    );
  }
}