import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  isOtpSent = false;
  error = '';
  savedEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) return null;
    const isOtpSent = control.get('otp')?.value !== undefined;
    // Only validate passwords if OTP has been sent
    if (!isOtpSent) return null;

    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    this.error = '';

    if (!this.isOtpSent) {
      // Step 1: Request OTP
      this.savedEmail = this.forgotPasswordForm.value.email;
      this.authService.forgotPassword(this.savedEmail).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.isOtpSent = true;
            this.toast.success('Verification code sent! Please check your email.');
            
            // Add required validators for the new fields dynamically
            this.forgotPasswordForm.get('otp')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
            this.forgotPasswordForm.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
            this.forgotPasswordForm.get('confirmPassword')?.setValidators([Validators.required]);
            
            this.forgotPasswordForm.get('otp')?.updateValueAndValidity();
            this.forgotPasswordForm.get('newPassword')?.updateValueAndValidity();
            this.forgotPasswordForm.get('confirmPassword')?.updateValueAndValidity();

            if (res.data) {
               console.log('%c[TESTING ONLY] Verification Code:', 'color: #00ff00; font-weight: bold; font-size: 14px', res.data);
            }
          } else {
            this.error = res.message || 'Failed to send verification code.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to send verification code. Please try again.';
        }
      });
    } else {
      // Step 2: Verify OTP and Reset Password
      const request = {
        email: this.savedEmail,
        otp: this.forgotPasswordForm.value.otp,
        newPassword: this.forgotPasswordForm.value.newPassword,
        confirmPassword: this.forgotPasswordForm.value.confirmPassword
      };

      this.authService.resetPassword(request).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.toast.success('Password successfully reset! Please login with your new password.');
            this.router.navigate(['/login']);
          } else {
            this.error = res.message || 'Failed to reset password.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Invalid verification code or password criteria not met.';
        }
      });
    }
  }
}
