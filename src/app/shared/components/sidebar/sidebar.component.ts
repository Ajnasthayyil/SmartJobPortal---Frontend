import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';

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
  
  currentPath = '';
  
  logout() {
    this.authService.logout();
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
    } else {
      // Default or other roles
      this.links = this.candidateLinks; 
    }
  }
}
