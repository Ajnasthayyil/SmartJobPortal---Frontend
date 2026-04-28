import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserListItem } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  users      = signal<UserListItem[]>([]);
  filtered   = signal<UserListItem[]>([]);
  loading    = signal(true);
  processing = signal<number | null>(null);

  search     = '';
  roleFilter = '';
  statusFilter = '';

  constructor(
    private service: AdminService,
    private toast:   ToastService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.service.getUsers(
      this.roleFilter || undefined,
      this.statusFilter === '' ? undefined : this.statusFilter === 'active'
    ).subscribe({
      next: res => {
        if (res.success) {
          this.users.set(res.data || []);
          this.applySearch();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applySearch(): void {
    const q = this.search.toLowerCase();
    this.filtered.set(
      this.users().filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    );
  }

  toggleBlock(user: UserListItem): void {
    this.processing.set(user.userId);
    const call = user.isActive
      ? this.service.blockUser(user.userId)
      : this.service.unblockUser(user.userId);

    call.subscribe({
      next: res => {
        this.processing.set(null);
        if (res.success) {
          this.toast.success(res.data);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.processing.set(null);
        this.toast.error('Action failed.');
      }
    });
  }

  getRoleClass(role: string): string {
    const m: Record<string, string> = {
      Admin: 'role-admin', Recruiter: 'role-recruiter', Candidate: 'role-candidate'
    };
    return m[role] || '';
  }
}