import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators, FormsModule, FormArray
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateProfile } from '../../../core/models/candidate.models';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
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
  completion = signal(0);
  isEditModalOpen = signal(false);

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
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      skills: this.fb.array([]),
      education: this.fb.array([]),
      workExperience: this.fb.array([])
    });
  }

  get skillGroups() {
    return (this.form.get('skills') as FormArray);
  }

  get educationGroups() {
    return (this.form.get('education') as FormArray);
  }

  get experienceGroups() {
    return (this.form.get('workExperience') as FormArray);
  }

  addEducation() {
    this.educationGroups.push(this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      duration: ['', Validators.required]
    }));
  }

  removeEducation(index: number) {
    this.educationGroups.removeAt(index);
  }

  addExperience() {
    this.experienceGroups.push(this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  removeExperience(index: number) {
    this.experienceGroups.removeAt(index);
  }

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.loading.set(true);
    this.service.getProfile().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.calcCompletion(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openEditModal(): void {
    const data = this.profile();
    if (!data) return;

    this.form.patchValue({
      headline: data.headline,
      summary: data.summary,
      location: data.location,
      experienceYears: data.experienceYears
    });

    // Handle education array
    this.educationGroups.clear();
    if (data.education) {
      data.education.forEach(edu => {
        this.educationGroups.push(this.fb.group(edu));
      });
    }

    // Handle experience array
    this.experienceGroups.clear();
    if (data.workExperience) {
      data.workExperience.forEach(exp => {
        this.experienceGroups.push(this.fb.group(exp));
      });
    }
    // Handle skills array
    this.skillGroups.clear();
    if (data.skills) {
      data.skills.forEach(s => {
        this.skillGroups.push(this.fb.group({
          skillName: [s.skillName, Validators.required],
          level: [s.level || 'Intermediate', Validators.required]
        }));
      });
    }
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
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

  addSkill(name: string) {
    const t = name.trim();
    if (!t) return;
    this.skillGroups.push(this.fb.group({
      skillName: [t, Validators.required],
      level: ['Intermediate', Validators.required]
    }));
    this.skillInput.set('');
  }

  removeSkill(index: number) {
    this.skillGroups.removeAt(index);
  }

  skillInput = signal('');

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
          this.toast.success('Profile updated successfully!');
          this.profile.set(res.data);
          this.calcCompletion(res.data);
          this.closeEditModal();
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