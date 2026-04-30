import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-candidate-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent {
  constructor(public sidebarService: SidebarService) {}

  onHover(val: boolean) {
    this.sidebarService.setExpanded(val);
  }
  links = [
    {
      group: 'MAIN MENU',
      items: [
        { path: "/candidate/dashboard", iconClass: "fa-solid fa-layer-group", label: "Dashboard" },
        { path: "/candidate/jobs", iconClass: "fa-solid fa-briefcase", label: "Job Search" },
        { path: "/candidate/companies", iconClass: "fa-solid fa-building", label: "Companies" },
      ]
    },
    {
      group: 'CANDIDATE AREA',
      items: [
        { path: "/candidate/profile", iconClass: "fa-solid fa-user", label: "My Profile" },
        { path: "/candidate/applications", iconClass: "fa-solid fa-file-invoice", label: "Applications" },
        { path: "/candidate/skill-gap", iconClass: "fa-solid fa-graduation-cap", label: "Skill Gap" },
      ]
    },
    {
      group: 'OTHERS',
      items: [
        { path: "/candidate/notifications", iconClass: "fa-solid fa-bell", label: "Notifications" },
        { path: "/candidate/settings", iconClass: "fa-solid fa-gear", label: "Settings" },
      ]
    }
  ];
}
