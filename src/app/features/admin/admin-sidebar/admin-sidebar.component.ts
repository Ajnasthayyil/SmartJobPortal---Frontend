import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  constructor(public sidebarService: SidebarService) {}

  onHover(val: boolean) {
    this.sidebarService.setExpanded(val);
  }
  links = [
    {
      group: 'SYSTEM',
      items: [
        { path: "/admin/dashboard", iconClass: "fa-solid fa-gauge", label: "Admin Panel" },
      ]
    },
    {
      group: 'MANAGEMENT',
      items: [
        { path: "/admin/users", iconClass: "fa-solid fa-users", label: "Manage Users" },
        { path: "/admin/recruiters", iconClass: "fa-solid fa-user-tie", label: "Manage Recruiters" },
        { path: "/admin/jobs", iconClass: "fa-solid fa-briefcase", label: "Job Moderation" },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { path: "/admin/notifications", iconClass: "fa-solid fa-bell", label: "Notifications" },
        { path: "/admin/settings", iconClass: "fa-solid fa-sliders", label: "Global Settings" },
      ]
    }
  ];
}
