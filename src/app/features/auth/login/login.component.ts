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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading  = signal(false);
  showPass = signal(false);
  apiError = signal('');

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private toast:  ToastService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn()) this.auth.redirectByRole();

    this.form = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  togglePassword() { this.showPass.update(v => !v); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    this.apiError.set('');

    this.auth.login({
      email:    this.email.value.trim().toLowerCase(),
      password: this.password.value
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success(`Welcome back, ${res.data.fullName}!`);
          this.auth.redirectByRole();
        } else {
          this.apiError.set(res.message || 'Login failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.apiError.set(
          err?.error?.message || 'Invalid email or password.'
        );
      }
    });
  }
}