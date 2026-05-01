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
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

  form: FormGroup;
  profile = signal<any>(null);
  loading = signal(true);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.form.patchValue(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
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
          this.toast.success('Admin profile updated!');
          this.profile.set(res.data);
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to update profile.');
      }
    });
  }
}
