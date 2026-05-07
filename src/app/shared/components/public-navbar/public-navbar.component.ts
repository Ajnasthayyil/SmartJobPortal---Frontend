import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationBellComponent],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavbarComponent {
  mobileOpen = signal(false);

  constructor(
    public auth:    AuthService,
    private router: Router
  ) {}

  goToDashboard(): void {
    this.auth.redirectByRole();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const user = this.auth.currentUser();
    if (!user || !user.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}