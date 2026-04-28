import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Bell, User, LogOut, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  authService = inject(AuthService);
  isProfileOpen = signal(false);

  readonly Bell = Bell;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly ChevronDown = ChevronDown;

  toggleProfile() {
    this.isProfileOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
