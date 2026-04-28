import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smart-job-portal';
  
  private router = inject(Router);
  private location = inject(Location);
  
  hasSidebar(): boolean {
    const path = this.location.path();
    return path.includes('/candidate') || path.includes('/recruiter') || path.includes('/admin');
  }

  constructor() {}
}
