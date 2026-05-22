import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, of } from 'rxjs';
import { ApiResponse } from '../../../core/models/auth.models';

@Component({
  selector: 'app-profile-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.scss'] // ✅ Reverted to plural for compatibility
})
export class ProfileAdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  form: FormGroup;
  profile = signal<any>(null);
  saving = signal(false);
  loading = signal(true);
  isEditModalOpen = signal(false);

  constructor() {
    const urlPattern = '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$';
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      linkedInUrl: ['', [Validators.pattern(urlPattern)]],
      gitHubUrl:   ['', [Validators.pattern(urlPattern)]],
      twitterUrl:  ['', [Validators.pattern(urlPattern)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.adminService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          const socials = JSON.parse(localStorage.getItem(`admin_socials_${res.data.userId}`) || '{}');
          this.profile.set({ ...res.data, ...socials });
          this.form.patchValue({ ...res.data, ...socials });
        } else {
          this.useFallback();
        }
        this.loading.set(false);
      },
      error: () => {
        this.useFallback();
        this.loading.set(false);
      }
    });
  }

  openEditModal(): void {
    this.form.patchValue(this.profile());
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  private useFallback(): void {
    // High-fidelity fallback for dev mode
    const mock = {
      fullName: 'AJNAS THAYYIL',
      email: 'admin@smartjobportal.com',
      phoneNumber: '7025882784',
      linkedInUrl: 'https://linkedin.com/in/ajnasthayyil',
      gitHubUrl: 'https://github.com/ajnasthayyil',
      twitterUrl: 'https://twitter.com/ajnasthayyil'
    };
    this.profile.set(mock);
    this.form.patchValue(mock);
  }

  onPhotoSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.authService.uploadPhoto(file).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Professional portrait updated.');
          // Profile signal will update via AuthService.uploadPhoto's tap() logic
        }
      },
      error: () => this.toast.error('Portrait synchronization failed.')
    });
  }

  onSave(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formValue = this.form.getRawValue();
    const updatePayload = {
      fullName: formValue.fullName,
      phoneNumber: formValue.phoneNumber
    };

    this.adminService.updateProfile(updatePayload).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Executive profile synchronized successfully.');
          const socials = {
            linkedInUrl: formValue.linkedInUrl || '',
            gitHubUrl:   formValue.gitHubUrl   || '',
            twitterUrl:  formValue.twitterUrl  || ''
          };
          localStorage.setItem(`admin_socials_${res.data.userId || 1}`, JSON.stringify(socials));
          this.profile.set({ ...res.data, ...socials });
          this.closeEditModal();
        } else {
          this.toast.error('Synchronization failed.');
        }
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Network synchronization error.');
      }
    });
  }
}
