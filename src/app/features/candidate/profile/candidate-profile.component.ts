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
  
  // Wizard State
  currentStep = signal(0); // 0: Start/Upload, 1: Basics, 2: Experience, 3: Education, 4: Socials, 5: Skills
  totalSteps = 5;
  isWizardMode = signal(false);

  readonly levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  readonly indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

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
      phoneNumber: [''],
      linkedInUrl: [''],
      gitHubUrl: [''],
      leetCodeUrl: [''],
      skills: this.fb.array([]),
      education: this.fb.array([]),
      workExperience: this.fb.array([])
    });
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
      window.scrollTo(0, 0);
    }
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
          if (res.data.education) {
            res.data.education = res.data.education.map((edu: any) => ({
              ...edu,
              duration: edu.duration || edu.graduationYear || ''
            }));
          }
          this.profile.set(res.data);
          this.calcCompletion(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  startWizard(mode: 'manual' | 'ai') {
    this.isWizardMode.set(true);
    if (mode === 'manual') {
      const data = this.profile();
      if (data) {
        this.form.patchValue({
          headline: data.headline,
          summary: data.summary,
          location: data.location,
          experienceYears: data.experienceYears,
          phoneNumber: data.phoneNumber || '',
          linkedInUrl: data.linkedInUrl || '',
          gitHubUrl: data.gitHubUrl || '',
          leetCodeUrl: data.leetCodeUrl || ''
        });

        this.educationGroups.clear();
        data.education?.forEach((edu: any) => {
          this.educationGroups.push(this.fb.group({
            degree: [edu.degree || '', Validators.required],
            institution: [edu.institution || '', Validators.required],
            fieldOfStudy: [edu.fieldOfStudy || '', Validators.required],
            duration: [edu.duration || edu.graduationYear || '', Validators.required]
          }));
        });

        this.experienceGroups.clear();
        data.workExperience?.forEach(exp => this.experienceGroups.push(this.fb.group({
          company: [exp.company || '', Validators.required],
          role: [exp.role || '', Validators.required],
          duration: [exp.duration || '', Validators.required],
          description: [exp.description || '', Validators.required]
        })));

        this.skillGroups.clear();
        data.skills?.forEach(s => this.skillGroups.push(this.fb.group({
          skillName: [s.skillName, Validators.required],
          level: [s.level || 'Intermediate', Validators.required]
        })));
      }
      this.currentStep.set(1);
    } else {
      this.currentStep.set(0);
    }
  }

  calcCompletion(p: CandidateProfile): void {
    let s = 0;
    
    // Identity (30%)
    if (p.fullName) s += 5;
    if (p.headline) s += 5;
    if (p.summary) s += 10;
    if (p.location) s += 5;
    if (p.phoneNumber) s += 5;

    // Professional History (20%)
    if (p.workExperience?.length) s += 20;

    // Education (15%)
    if (p.education?.length) s += 15;

    // Skills (15%)
    if (p.skills?.length) s += 15;

    // Social Links (10%)
    if (p.linkedInUrl || p.gitHubUrl || p.leetCodeUrl) s += 10;

    // Resume (10%)
    if (p.hasResume) s += 10;

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
      this.toast.error('Please fill in all required fields (Headline, Summary, etc.)');
      return;
    }
    this.saving.set(true);
    this.service.updateProfile(this.form.value).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Profile updated successfully!');
          if (res.data && res.data.education) {
            res.data.education = res.data.education.map((edu: any) => ({
              ...edu,
              duration: edu.duration || edu.graduationYear || ''
            }));
          }
          this.profile.set(res.data);
          this.calcCompletion(res.data);
          this.isWizardMode.set(false);
          this.currentStep.set(0);
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Profile Update Error:', err);
        
        let msg = 'Failed to update profile.';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.errors) {
          // Handle ASP.NET Core Validation Errors
          const firstError = Object.values(err.error.errors)[0] as string[];
          if (firstError?.length) msg = firstError[0];
        } else if (err.message) {
          msg = err.message;
        }
        
        this.toast.error(msg);
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
        if (res.success && res.data.parsedData) {
          const ai = res.data.parsedData;
          this.toast.success('Resume parsed successfully! Please review the details.');
          
          // Auto-fill form
          this.form.patchValue({
            headline: ai.fullName ? `${ai.fullName} - Professional Profile` : '',
            summary: ai.workExperience?.map(e => e.description).join('\n') || '',
            phoneNumber: ai.phone || '',
            linkedInUrl: ai.linkedIn || '',
            gitHubUrl: ai.gitHub || '',
            leetCodeUrl: ai.leetCode || '',
            experienceYears: ai.totalExperience || 0
          });

          // Patch arrays
          this.experienceGroups.clear();
          ai.workExperience?.forEach(exp => {
            this.experienceGroups.push(this.fb.group({
              company: [exp.company, Validators.required],
              role: [exp.role, Validators.required],
              duration: [exp.duration, Validators.required],
              description: [exp.description, Validators.required]
            }));
          });

          this.educationGroups.clear();
          ai.education?.forEach(edu => {
            this.educationGroups.push(this.fb.group({
              degree: [edu.degree, Validators.required],
              institution: [edu.institution, Validators.required],
              fieldOfStudy: [edu.fieldOfStudy || '', Validators.required],
              duration: [edu.duration || '', Validators.required]
            }));
          });

          this.skillGroups.clear();
          ai.skills?.forEach(s => {
            this.skillGroups.push(this.fb.group({
              skillName: [s, Validators.required],
              level: ['Intermediate', Validators.required]
            }));
          });

          // Move to next step for review
          this.currentStep.set(1);
          this.isWizardMode.set(true);

        } else {
          this.toast.error(res.message || 'Parsing failed.');
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