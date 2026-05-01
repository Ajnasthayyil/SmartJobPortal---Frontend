import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { RecruiterProfile } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecruiterProfileComponent implements OnInit {
  form: FormGroup;
  profile = signal<RecruiterProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploading = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: RecruiterService,
    public auth: AuthService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      website: ['', [Validators.pattern('https?://.+')]],
      industry: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]]
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
          this.form.patchValue({
            companyName: res.data.companyName,
            website: res.data.website,
            industry: res.data.industry,
            location: res.data.location,
            description: res.data.description
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
      return;
    }

    this.saving.set(true);
    this.service.updateProfile(this.form.value).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Company profile updated!');
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

  onPhotoSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadPhoto(file);
  }

  uploadPhoto(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.toast.error('Only image files are allowed.');
      return;
    }
    this.uploading.set(true);
    this.auth.uploadPhoto(file).subscribe({
      next: res => {
        this.uploading.set(false);
        if (res.success) {
          this.toast.success('Profile photo updated!');
          const current = this.profile();
          if (current) {
            // Since photo URL is in User table usually, header updates automatically 
            // via AuthService signal. We can just refresh or assume it worked.
          }
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.uploading.set(false);
        this.toast.error('Failed to upload photo.');
      }
    });
  }
}
