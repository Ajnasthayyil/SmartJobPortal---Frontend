import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  
  currentPath = '';
  
  // Grouped links with headings
  candidateLinks = [
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
