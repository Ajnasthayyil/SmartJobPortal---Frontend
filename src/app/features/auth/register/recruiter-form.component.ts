import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-recruiter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="form">

      <!-- Name fields -->
      <div class="fieldset-half">
        <div class="field-group">
          <label for="fname">First name</label>
          <div class="field-wrap">
            <input id="fname" type="text" class="field-input"
                   formControlName="firstName"
                   [class.is-error]="firstName.invalid && firstName.touched"
                   placeholder="First"/>
          </div>
          @if (firstName.invalid && firstName.touched) {
            <p class="field-error">First name is required.</p>
          }
        </div>
        <div class="field-group">
          <label for="lname">Last name</label>
          <div class="field-wrap">
            <input id="lname" type="text" class="field-input"
                   formControlName="lastName"
                   [class.is-error]="lastName.invalid && lastName.touched"
                   placeholder="Last"/>
          </div>
          @if (lastName.invalid && lastName.touched) {
            <p class="field-error">Last name is required.</p>
          }
        </div>
      </div>

      <!-- Company -->
      <div class="field-group">
        <label for="company">Company name</label>
        <div class="field-wrap">
          <svg class="field-icon" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <input id="company" type="text" class="field-input"
                 formControlName="companyName"
                 [class.is-error]="companyName.invalid && companyName.touched"
                 placeholder="Acme Inc." required/>
        </div>
        @if (companyName.invalid && companyName.touched) {
          <p class="field-error">Company name is required.</p>
        }
      </div>

      <!-- Email -->
      <div class="field-group">
        <label for="email">Email address</label>
        <div class="field-wrap">
          <svg class="field-icon" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <input id="email" type="email" class="field-input"
                 formControlName="email"
                 [class.is-error]="email.invalid && email.touched"
                 placeholder="you@company.io"/>
        </div>
        @if (email.invalid && email.touched) {
          <p class="field-error">
            @if (email.errors?.['required']) { Email is required. }
            @if (email.errors?.['email'])    { Enter a valid email. }
          </p>
        }
      </div>

      <!-- Password -->
      <div class="field-group">
        <label for="password">Password</label>
        <div class="field-wrap">
          <svg class="field-icon" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input id="password" [type]="showPass() ? 'text' : 'password'"
                 class="field-input"
                 formControlName="password"
                 [class.is-error]="password.invalid && password.touched"
                 placeholder="Min 6 characters"/>
          <button type="button" class="eye-btn"
                  (click)="togglePassword()"
                  [attr.aria-label]="showPass() ? 'Hide' : 'Show'">
            @if (!showPass()) {
              <svg width="16" height="16" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            } @else {
              <svg width="16" height="16" fill="none" stroke="currentColor"
                   stroke-width="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
                         a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
                         a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            }
          </button>
        </div>
        @if (password.invalid && password.touched) {
          <p class="field-error">Minimum 6 characters.</p>
        }
      </div>

      <!-- Phone -->
      <div class="field-group">
        <label for="phone">Phone number</label>
        <div class="field-wrap">
          <svg class="field-icon" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                     a19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2
                     h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11
                     L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45
                     12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <input id="phone" type="tel" class="field-input"
                 formControlName="phoneNumber"
                 placeholder="+1 (555) 000-0000"/>
        </div>
      </div>

      <!-- Industry -->
      <div class="field-group">
        <label for="industry">Industry</label>
        <div class="field-wrap">
          <select id="industry" class="field-input"
                  formControlName="industry" required>
            <option value="">Select industry...</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Retail</option>
            <option>Manufacturing</option>
          </select>
        </div>
      </div>

      <!-- Website -->
      <div class="field-group">
        <label for="website">Website (optional)</label>
        <div class="field-wrap">
          <svg class="field-icon" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
                     15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <input id="website" type="url" class="field-input"
                 formControlName="website"
                 placeholder="https://company.com"/>
        </div>
      </div>

      <!-- Terms -->
      <div class="form-opts">
        <input class="checkbox" type="checkbox" id="terms2"
               formControlName="agreeToTerms" required/>
        <label for="terms2">
          I agree to the <a href="#">Terms of Service</a> and
          <a href="#">Privacy Policy</a>
        </label>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn-submit" [disabled]="loading()">
        @if (loading()) {
          <span class="spinner"></span> Creating account...
        } @else {
          Create Recruiter Account
        }
      </button>

    </form>
  `
})
export class RecruiterFormComponent {
  form: FormGroup;
  loading  = signal(false);
  showPass = signal(false);

  constructor(
    private fb:      FormBuilder,
    private auth:    AuthService,
    private toast:   ToastService
  ) {
    this.form = this.fb.group({
      firstName:    ['', Validators.required],
      lastName:     ['', Validators.required],
      companyName:  ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      password:     ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber:  [''],
      industry:     ['', Validators.required],
      website:      [''],
      agreeToTerms: [false, Validators.required]
    });
  }

  get firstName()   { return this.form.get('firstName')!; }
  get lastName()    { return this.form.get('lastName')!; }
  get companyName() { return this.form.get('companyName')!; }
  get email()       { return this.form.get('email')!; }
  get password()    { return this.form.get('password')!; }

  togglePassword(): void { this.showPass.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const fullName = `${this.firstName.value} ${this.lastName.value}`.trim();

    this.auth.registerRecruiter({
      fullName,
      email: this.email.value.trim().toLowerCase(),
      password: this.password.value,
      phoneNumber: this.form.get('phoneNumber')?.value || '',
      roleId: 2 // Recruiter
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success(
            'Account created! Your account is awaiting admin approval.'
          );
          // Redirect handled by component
        } else {
          this.toast.error(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(err?.error?.message || 'An error occurred.');
      }
    });
  }
}