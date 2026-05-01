import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-recruiter-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter-sidebar.component.html',
  styleUrls: ['./recruiter-sidebar.component.scss']
})
export class RecruiterSidebarComponent {
  constructor(public sidebarService: SidebarService) {}

  onHover(val: boolean) {
    this.sidebarService.setExpanded(val);
  }

  links = [
    {
      group: 'MAIN MENU',
      items: [
        { path: "/recruiter/dashboard", iconClass: "fa-solid fa-chart-line", label: "Dashboard" },
        { path: "/recruiter/manage-jobs", iconClass: "fa-solid fa-list-check", label: "My Job Listings" },
        { path: "/recruiter/candidates", iconClass: "fa-solid fa-users", label: "Talent Pool" },
      ]
    },
    {
      group: 'HIRING TOOLS',
      items: [
        { path: "/recruiter/post-job", iconClass: "fa-solid fa-plus-circle", label: "Post New Job" },
        { path: "/recruiter/applicants", iconClass: "fa-solid fa-user-tie", label: "Active Applicants" },
        { path: "/recruiter/interviews", iconClass: "fa-solid fa-calendar-check", label: "Interviews" },
      ]
    },
    {
      group: 'OTHERS',
      items: [
        { path: "/recruiter/notifications", iconClass: "fa-solid fa-bell", label: "Notifications" },
        { path: "/recruiter/settings", iconClass: "fa-solid fa-gear", label: "Settings" },
      ]
    }
  ];
}
