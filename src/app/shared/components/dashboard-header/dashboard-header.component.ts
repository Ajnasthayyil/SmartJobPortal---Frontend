import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';

import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  
  isDropdownOpen = false;

  onSearch(keyword: string, event: Event): void {
    event.preventDefault();
    if (!keyword || !keyword.trim()) return;
    
    const role = this.authService.currentUser()?.role;
    if (role === 'Admin') {
      this.router.navigate(['/admin/jobs'], { queryParams: { keyword: keyword.trim() } });
    } else if (role === 'Recruiter') {
      this.router.navigate(['/recruiter/jobs'], { queryParams: { keyword: keyword.trim() } });
    } else {
      this.router.navigate(['/candidate/jobs'], { queryParams: { keyword: keyword.trim() } });
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout(true);
    this.isDropdownOpen = false;
  }

  getProfileUrl(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase() || 'candidate';
    return `/${role}/profile`;
  }

  getSettingsUrl(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase() || 'candidate';
    return `/${role}/profile`; // Keep profile route mapping
  }

  getRoleSubtitle(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'Admin') {
      return 'Explore information and activity about your portal';
    } else if (role === 'Recruiter') {
      return 'Explore information and activity about your candidates and jobs';
    } else {
      return 'Explore information and activity about your career';
    }
  }

  get firstName(): string {
    const fullName = this.authService.currentUser()?.fullName;
    return fullName ? fullName.split(' ')[0] : 'User';
  }
}
