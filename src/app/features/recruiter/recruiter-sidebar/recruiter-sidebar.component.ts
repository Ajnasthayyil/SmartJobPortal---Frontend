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
        { path: "/recruiter/dashboard", iconClass: "fa-solid fa-layer-group", label: "Dashboard" },
        { path: "/recruiter/post-job", iconClass: "fa-solid fa-circle-plus", label: "Post New Job" },
        { path: "/recruiter/jobs", iconClass: "fa-solid fa-briefcase", label: "Manage Jobs" },
      ]
    },
    {
      group: 'RECRUITER AREA',
      items: [
        { path: "/recruiter/profile", iconClass: "fa-solid fa-user-tie", label: "Company Profile" },
        { path: "/recruiter/applicants", iconClass: "fa-solid fa-users", label: "All Applicants" },
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
