import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService
  ) {}

  onHover(val: boolean) {
    this.sidebarService.setExpanded(val);
  }

  logout() {
    this.authService.logout();
  }

  links = [
    {
      group: 'CONTROL PANEL',
      items: [
        { path: "/", iconClass: "fa-solid fa-house", label: "Home Page" },
        { path: "/admin/dashboard", iconClass: "fa-solid fa-gauge-high", label: "Dashboard" },
        { path: "/admin/users", iconClass: "fa-solid fa-users-gear", label: "User Management" },
        { path: "/admin/recruiters", iconClass: "fa-solid fa-user-check", label: "Recruiter Approvals" },
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { path: "/admin/jobs", iconClass: "fa-solid fa-clipboard-list", label: "Active Jobs" },
        { path: "/admin/profile", iconClass: "fa-solid fa-user-shield", label: "Admin Account" },
      ]
    }
  ];
}
