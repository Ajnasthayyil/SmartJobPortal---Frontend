import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = signal(false);
  showPass = signal(false);
  apiError = signal('');

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn()) this.auth.redirectByRole();

    this.form = this.fb.group({
      fullName:    ['', [Validators.required, Validators.minLength(2)]],
      email:       ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password:    ['', [Validators.required, Validators.minLength(6)]],
      roleId:      [3, [Validators.required]] // Default to Candidate (3)
    });
  }

  get fullName()    { return this.form.get('fullName')!; }
  get email()       { return this.form.get('email')!; }
  get phoneNumber() { return this.form.get('phoneNumber')!; }
  get password()    { return this.form.get('password')!; }
  get roleId()      { return this.form.get('roleId')!; }

  togglePassword() { this.showPass.update(v => !v); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    this.apiError.set('');

    const formVal = this.form.value;
    const req = {
      fullName:    formVal.fullName.trim(),
      email:       formVal.email.trim().toLowerCase(),
      phoneNumber: formVal.phoneNumber.trim(),
      password:    formVal.password,
      roleId:      Number(formVal.roleId)
    };

    const registerObs = req.roleId === 2 
      ? this.auth.registerRecruiter(req) 
      : this.auth.registerCandidate(req);

    registerObs.subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Registration successful! Please sign in.');
          this.router.navigate(['/login']);
        } else {
          this.apiError.set(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.apiError.set(
          err?.error?.message || 'Failed to register account.'
        );
      }
    });
  }
}