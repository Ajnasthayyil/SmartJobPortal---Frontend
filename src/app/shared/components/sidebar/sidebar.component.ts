import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private authService = inject(AuthService);
  public sidebarService = inject(SidebarService);
  
  currentPath = '';
  
  logout() {
    this.authService.logout(true);
  }
  
  // Grouped links with headings
  candidateLinks = [
    {
      group: 'MAIN MENU',
      items: [
        { path: "/", iconClass: "fa-solid fa-house", label: "Home Page" },
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
    }
  ];

  recruiterLinks = [
    {
      group: 'MAIN MENU',
      items: [
        { path: "/", iconClass: "fa-solid fa-house", label: "Home Page" },
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
    }
  ];

  adminLinks = [
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

  links: any[] = [];

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLinks();
    });
    this.updateLinks();
  }

  updateLinks() {
    this.currentPath = this.location.path();
    if (this.currentPath.includes('/candidate')) {
      this.links = this.candidateLinks;
    } else if (this.currentPath.includes('/recruiter')) {
      this.links = this.recruiterLinks;
    } else if (this.currentPath.includes('/admin')) {
      this.links = this.adminLinks;
    } else {
      // Default fallback
      this.links = this.candidateLinks; 
    }
  }
}
