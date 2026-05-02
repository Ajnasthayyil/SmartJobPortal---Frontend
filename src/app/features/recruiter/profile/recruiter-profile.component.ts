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

  // Character counts
  get descLength(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  // Form control getters
  get companyName() { return this.form.get('companyName')!; }
  get industry()    { return this.form.get('industry')!; }
  get website()     { return this.form.get('website')!; }
  get location()    { return this.form.get('location')!; }
  get description() { return this.form.get('description')!; }

  constructor(
    private fb:      FormBuilder,
    private service: RecruiterService,
    private auth:    AuthService,
    private toast:   ToastService
  ) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required,
                         Validators.minLength(2),
                         Validators.maxLength(150)]],
      industry:    ['', Validators.required],
      website:     ['', [Validators.pattern('https?://.+')]],
      location:    ['', Validators.required],
      description: ['', [Validators.required,
                         Validators.minLength(50),
                         Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          // Patch only the fields the API accepts
          this.form.patchValue({
            companyName: res.data.companyName || '',
            industry:    res.data.industry    || '',
            website:     res.data.website     || '',
            location:    res.data.location    || '',
            description: res.data.description || ''
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fix the errors before saving.');
      return;
    }

    this.saving.set(true);

    // Only send what the API expects
    const payload = {
      companyName: this.form.value.companyName,
      website:     this.form.value.website     || '',
      industry:    this.form.value.industry,
      description: this.form.value.description,
      location:    this.form.value.location
    };

    this.service.updateProfile(payload).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Company profile updated successfully!');
          if (res.data) this.profile.set(res.data);
        } else {
          this.toast.error(res.message || 'Update failed.');
        }
      },
      error: err => {
        this.saving.set(false);
        this.toast.error(
          err?.error?.message || 'Failed to update profile. Try again.'
        );
      }
    });
  }

  getInitials(): string {
    const name = this.profile()?.companyName ||
                 this.companyName.value || '?';
    return name.charAt(0).toUpperCase();
  }

  getFullName(): string {
    return this.auth.currentUser()?.fullName || 'Recruiter';
  }

  getUserEmail(): string {
    return this.auth.currentUser()?.email || '';
  }
}