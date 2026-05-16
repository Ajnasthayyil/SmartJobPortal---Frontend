import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SidebarService } from './core/services/sidebar.service';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';

import { ToastContainerComponent } from './shared/components/toast/toast-container.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="layout-container" 
         [class.has-sidebar]="showSidebar() && !isFullPage" 
         [class.sidebar-expanded]="sidebarService.isExpanded() && !isFullPage">
      
      <!-- Dashboard Header -->
      <ng-container *ngIf="isAuthPage() && !isFullPage">
        <app-dashboard-header></app-dashboard-header>
      </ng-container>

      <!-- Public Navbar -->
      <ng-container *ngIf="isPublicPage() && !isFullPage">
        <app-public-navbar></app-public-navbar>
      </ng-container>

      <!-- Sidebar -->
      <app-candidate-sidebar *ngIf="isCandidate() && !isFullPage"></app-candidate-sidebar>
      <app-recruiter-sidebar *ngIf="isRecruiter() && !isFullPage"></app-recruiter-sidebar>
      <app-admin-sidebar *ngIf="isAdmin() && !isFullPage"></app-admin-sidebar>

      <!-- Main Content -->
      <main [class.full-page]="isFullPage">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Footer -->
    <ng-container *ngIf="isPublicPage() && !isFullPage">
      <app-footer></app-footer>
    </ng-container>

    <!-- Global Toast Notifications -->
    <app-toast-container></app-toast-container>


  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isFullPage = false;
  authService = inject(AuthService);

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public sidebarService: SidebarService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.isFullPage = data['fullPage'] === true;
    });
  }


  showSidebar(): boolean {
    return this.isCandidate() || this.isRecruiter() || this.isAdmin();
  }

  isCandidate(): boolean {
    return this.router.url.startsWith('/candidate') || 
           (this.router.url.startsWith('/feed') && this.authService.getRole() === 'Candidate');
  }

  isRecruiter(): boolean {
    return this.router.url.startsWith('/recruiter') || 
           (this.router.url.startsWith('/feed') && this.authService.getRole() === 'Recruiter');
  }

  isAdmin(): boolean {
    return this.router.url.startsWith('/admin') || 
           (this.router.url.startsWith('/feed') && this.authService.getRole() === 'Admin');
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return (
      url.startsWith('/candidate') ||
      url.startsWith('/recruiter') ||
      url.startsWith('/admin') ||
      url.startsWith('/feed')
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
      url.startsWith('/admin') ||
      url.startsWith('/feed')
    );
  }
}