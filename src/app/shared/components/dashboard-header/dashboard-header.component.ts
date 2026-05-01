import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  authService = inject(AuthService);
  
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
  }

  getProfileUrl(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase() || 'candidate';
    return `/${role}/profile`;
  }

  getSettingsUrl(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase() || 'candidate';
    return `/${role}/settings`;
  }
}
