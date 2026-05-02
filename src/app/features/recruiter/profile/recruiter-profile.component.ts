import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { RecruiterProfile } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss']
})
export class RecruiterProfileComponent implements OnInit {

  form:    FormGroup;
  profile  = signal<RecruiterProfile | null>(null);
  loading  = signal(true);
  saving   = signal(false);
  isEditModalOpen = signal(false);

  constructor(
    private fb:      FormBuilder,
    private service: RecruiterService,
    private auth:    AuthService,
    private toast:   ToastService
  ) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      industry:    ['', Validators.required],
      website:     ['', [Validators.pattern('https?://.+')]],
      location:    ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openEditModal(): void {
    const data = this.profile();
    if (data) {
      this.form.patchValue({
        companyName: data.companyName || '',
        industry:    data.industry    || '',
        website:     data.website     || '',
        location:    data.location    || '',
        description: data.description || ''
      });
    }
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fix the errors before saving.');
      return;
    }

    this.saving.set(true);
    this.service.updateProfile(this.form.value).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Company profile updated successfully!');
          if (res.data) this.profile.set(res.data);
          this.closeEditModal();
        } else {
          this.toast.error(res.message || 'Update failed.');
        }
      },
      error: err => {
        this.saving.set(false);
        this.toast.error(err?.error?.message || 'Failed to update profile.');
      }
    });
  }

  getInitials(): string {
    return (this.profile()?.companyName || 'C').charAt(0).toUpperCase();
  }

  getFullName(): string {
    return this.auth.currentUser()?.fullName || 'Recruiter';
  }

  getUserEmail(): string {
    return this.auth.currentUser()?.email || '';
  }
}