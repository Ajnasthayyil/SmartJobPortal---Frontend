import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent {

  form    = signal<FormGroup>(this.buildForm());
  saving  = signal(false);
  skills  = signal<string[]>([]);
  skillInput = signal('');

  readonly jobTypes = [
    'FullTime', 'PartTime', 'Remote', 'Internship', 'Contract'
  ];

  constructor(
    private fb:      FormBuilder,
    private service: RecruiterService,
    private toast:   ToastService,
    private router:  Router
  ) {}

  buildForm(): FormGroup {
    return this.fb.group({
      title:             ['', Validators.required],
      description:       ['', [Validators.required, Validators.minLength(50)]],
      location:          ['', Validators.required],
      jobType:           ['FullTime', Validators.required],
      minSalary:         [null],
      maxSalary:         [null],
      minExperienceYears:[0, [Validators.required, Validators.min(0)]],
      expiresAt:         [null]
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

    this.saving.set(true);
    this.service.postJob({ ...v, requiredSkills: this.skills() })
      .subscribe({
        next: res => {
          this.saving.set(false);
          if (res.success) {
            this.toast.success('Job posted successfully!');
            this.router.navigate(['/recruiter/jobs']);
          } else {
            this.toast.error(res.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Failed to post job.');
        }
      });
  }
}