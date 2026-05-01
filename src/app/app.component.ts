import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarService } from './core/services/sidebar.service';
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="layout-container" [class.has-sidebar]="showSidebar()" [class.sidebar-expanded]="sidebarService.isExpanded()">
      <!-- Dashboard Header -->
      <ng-container *ngIf="isAuthPage()">
        <app-dashboard-header></app-dashboard-header>
      </ng-container>

      <!-- Public Navbar -->
      <ng-container *ngIf="isPublicPage()">
        <app-public-navbar></app-public-navbar>
      </ng-container>

      <!-- Sidebar -->
      <app-candidate-sidebar *ngIf="isCandidate()"></app-candidate-sidebar>
      <app-recruiter-sidebar *ngIf="isRecruiter()"></app-recruiter-sidebar>
      <app-admin-sidebar *ngIf="isAdmin()"></app-admin-sidebar>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Footer -->
    <ng-container *ngIf="isPublicPage()">
      <app-footer></app-footer>
    </ng-container>

    <!-- Global Toast Notifications -->
    <app-toast-container></app-toast-container>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, public sidebarService: SidebarService) {}

  showSidebar(): boolean {
    return this.isCandidate() || this.isRecruiter() || this.isAdmin();
  }

  isCandidate(): boolean {
    return this.router.url.startsWith('/candidate');
  }

  isRecruiter(): boolean {
    return this.router.url.startsWith('/recruiter');
  }

  isAdmin(): boolean {
    return this.router.url.startsWith('/admin');
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