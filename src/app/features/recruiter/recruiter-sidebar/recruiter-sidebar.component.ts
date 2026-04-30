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
      group: 'OVERVIEW',
      items: [
        { path: "/recruiter/dashboard", iconClass: "fa-solid fa-chart-line", label: "Dashboard" },
      ]
    },
    {
      group: 'RECRUITMENT',
      items: [
        { path: "/recruiter/post-job", iconClass: "fa-solid fa-plus-circle", label: "Post New Job" },
        { path: "/recruiter/jobs", iconClass: "fa-solid fa-briefcase", label: "Manage Jobs" },
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
