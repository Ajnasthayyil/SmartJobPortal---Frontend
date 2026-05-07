import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators, FormsModule
} from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.scss']
})
export class ProfileAdminComponent implements OnInit {

  form: FormGroup;
  profile = signal<any>(null);
  loading = signal(true);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    public auth: AuthService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    // Since API might not be ready, we provide a fallback for demo/dev
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.form.patchValue(res.data);
        } else {
          // Mock data if API is empty
          this.profile.set({
            fullName: this.auth.currentUser()?.fullName || 'System Admin',
            email: this.auth.currentUser()?.email || 'admin@talex.ai',
            phoneNumber: '+1 (555) 000-1234',
            address: 'Silicon Valley, CA',
            bio: 'Senior System Administrator at TalEx Ecosystem.'
          });
          this.form.patchValue(this.profile());
        }
        this.loading.set(false);
      },
      error: () => {
        // Mock data on error too
        this.profile.set({
          fullName: 'System Admin',
          email: 'admin@talex.ai',
          phoneNumber: '+1 (555) 000-1234',
          address: 'Silicon Valley, CA',
          bio: 'Senior System Administrator at TalEx Ecosystem.'
        });
        this.form.patchValue(this.profile());
        this.loading.set(false);
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.service.updateProfile(this.form.getRawValue()).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Admin Profile Synchronized!');
          this.profile.set(res.data);
        } else {
          // For now, allow local update even if API fails (Dev mode)
          this.profile.set(this.form.getRawValue());
          this.toast.success('Profile updated (Local Dev Mode)');
        }
      },
      error: () => {
        this.saving.set(false);
        this.profile.set(this.form.getRawValue());
        this.toast.success('Profile updated (Local Dev Mode)');
      }
    });
  }
}
