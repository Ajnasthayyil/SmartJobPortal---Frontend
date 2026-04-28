import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateProfile } from '../../../core/models/candidate.models';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  form: FormGroup;
  profile = signal<CandidateProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploading = signal(false);
  resumeFile = signal<File | null>(null);
  dragOver = signal(false);
  skillInput = signal('');
  skills = signal<string[]>([]);
  completion = signal(0);

  readonly levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  constructor(
    private fb: FormBuilder,
    private service: CandidateService,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      headline: ['', Validators.required],
      summary: ['', [Validators.required, Validators.minLength(50)]],
      location: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.form.patchValue({
            headline: res.data.headline,
            summary: res.data.summary,
            location: res.data.location,
            experienceYears: res.data.experienceYears
          });
          this.skills.set(
            res.data.skills?.map(s => s.skillName) || []
          );
          this.calcCompletion(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  calcCompletion(p: CandidateProfile): void {
    let s = 0;
    if (p.fullName) s += 20;
    if (p.headline) s += 15;
    if (p.summary) s += 15;
    if (p.location) s += 10;
    if (p.skills?.length) s += 20;
    if (p.hasResume) s += 20;
    this.completion.set(s);
  }

  addSkill(value: string): void {
    const t = value.trim();
    if (!t) return;
    const current = this.skills();
    if (!current.map(s => s.toLowerCase()).includes(t.toLowerCase())) {
      this.skills.set([...current, t]);
    }
    this.skillInput.set('');
  }

  removeSkill(skill: string): void {
    this.skills.set(this.skills().filter(s => s !== skill));
  }

  onKeydown(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addSkill(value);
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.service.updateProfile({
      ...this.form.value,
      skills: this.skills().map(s => ({ skillName: s, level: 'Intermediate' }))
    }).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Profile updated successfully!');
          this.profile.set(res.data);
          this.calcCompletion(res.data);
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

  onResumeSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadResume(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadResume(file);
  }

  uploadResume(file: File): void {
    const allowed = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      this.toast.error('Only PDF and DOCX files allowed.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('File must be under 5MB.'); return;
    }
    this.uploading.set(true);
    this.resumeFile.set(file);
    this.service.uploadResume(file).subscribe({
      next: res => {
        this.uploading.set(false);
        if (res.success) {
          this.toast.success('Resume uploaded! Skills extracted automatically.');
          this.loadProfile();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.uploading.set(false);
        this.toast.error('Resume upload failed.');
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
          // Signal in AuthService already updates the header, 
          // we can also update local profile signal if needed.
          const current = this.profile();
          if (current) {
            this.profile.set({ ...current, profilePictureUrl: res.data.url });
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