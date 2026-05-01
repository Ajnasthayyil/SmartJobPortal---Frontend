import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {

  form    = signal<FormGroup>(this.buildForm());
  saving  = signal(false);
  loading = signal(true);
  skills  = signal<string[]>([]);
  skillInput = signal('');
  jobId = signal<number>(0);

  readonly jobTypes = [
    'FullTime', 'PartTime', 'Remote', 'Internship', 'Contract'
  ];

  constructor(
    private fb:      FormBuilder,
    private service: RecruiterService,
    private toast:   ToastService,
    private router:  Router,
    private route:   ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobId.set(+id);
      this.loadJob(+id);
    } else {
      this.toast.error('Invalid job ID');
      this.router.navigate(['/recruiter/jobs']);
    }
  }

  buildForm(): FormGroup {
    return this.fb.group({
      title:             ['', Validators.required],
      description:       ['', [Validators.required, Validators.minLength(50)]],
      location:          ['', Validators.required],
      jobType:           ['FullTime', Validators.required],
      minSalary:         [0],
      maxSalary:         [0],
      minExperienceYears:[0, [Validators.required, Validators.min(0)]],
      expiresAt:         [null],
      isActive:          [true]
    });
  }

  loadJob(id: number): void {
    this.service.getMyJobs().subscribe({
      next: res => {
        if (res.success && res.data) {
          const job = res.data.find(j => j.jobId === id);
          if (job) {
            this.form().patchValue({
              title: job.title,
              description: job.description,
              location: job.location,
              jobType: job.jobType,
              minSalary: job.minSalary || 0,
              maxSalary: job.maxSalary || 0,
              minExperienceYears: job.minExperienceYears || 0,
              expiresAt: job.expiresAt ? new Date(job.expiresAt).toISOString().split('T')[0] : null,
              isActive: job.isActive
            });
            this.skills.set(job.requiredSkills || []);
          } else {
            this.toast.error('Job not found');
            this.router.navigate(['/recruiter/jobs']);
          }
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load job details');
        this.router.navigate(['/recruiter/jobs']);
      }
    });
  }

  addSkill(value: string): void {
    const t = value.trim();
    if (!t) return;
    if (!this.skills().map(s => s.toLowerCase()).includes(t.toLowerCase())) {
      this.skills.update(s => [...s, t]);
    }
    this.skillInput.set('');
  }

  removeSkill(skill: string): void {
    this.skills.update(s => s.filter(x => x !== skill));
  }

  onKeydown(e: KeyboardEvent, val: string): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.addSkill(val);
    }
  }

  onSubmit(): void {
    const f = this.form();
    if (f.invalid) { f.markAllAsTouched(); return; }
    if (this.skills().length === 0) {
      this.toast.error('Add at least one required skill.');
      return;
    }

    const v = f.value;
    if (v.minSalary && v.maxSalary && v.minSalary > v.maxSalary) {
      this.toast.error('Min salary cannot exceed max salary.');
      return;
    }

    const payload = { ...v, requiredSkills: this.skills() };
    if (!payload.expiresAt) payload.expiresAt = null;
    if (payload.minSalary === '' || payload.minSalary === null) payload.minSalary = null;
    if (payload.maxSalary === '' || payload.maxSalary === null) payload.maxSalary = null;

    this.saving.set(true);
    this.service.updateJob(this.jobId(), payload)
      .subscribe({
        next: res => {
          this.saving.set(false);
          if (res.success) {
            this.toast.success('Job updated successfully!');
            this.router.navigate(['/recruiter/jobs']);
          } else {
            this.toast.error(res.message);
          }
        },
        error: (err) => {
          this.saving.set(false);
          if (err.error && err.error.message) {
            this.toast.error(err.error.message);
          } else if (err.error && err.error.title) {
            this.toast.error(err.error.title);
          } else {
            this.toast.error('Failed to update job.');
          }
        }
      });
  }
}
