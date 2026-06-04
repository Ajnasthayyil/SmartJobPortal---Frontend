import { Component, signal, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading  = signal(false);
  showPass = signal(false);


  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private toast:  ToastService,
    private router: Router,
    private ngZone: NgZone
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


    this.auth.login({
      email:    this.email.value.trim().toLowerCase(),
      password: this.password.value
    }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success(`Login successful!`);
          this.auth.redirectByRole();
        } else {
          this.toast.error(res.message || 'Login failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(
          err?.error?.errors?.[0] || err?.error?.message || 'Invalid email or password.'
        );
      }
    });
  }

  ngOnInit() {
    this.initGoogleSignIn();
  }

  initGoogleSignIn() {
    const checkGoogleInterval = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(checkGoogleInterval);
        
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => {
            this.ngZone.run(() => {
              this.handleGoogleCredential(response.credential);
            });
          }
        });

        const btnElem = document.getElementById('googleBtn');
        if (btnElem) {
          google.accounts.id.renderButton(btnElem, {
            theme: 'outline',
            size: 'large',
            width: btnElem.parentElement?.clientWidth || 380
          });
        }
      }
    }, 100);

    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkGoogleInterval), 5000);
  }

  handleGoogleCredential(idToken: string) {
    this.loading.set(true);

    this.auth.googleLogin(idToken).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Google login successful!');
          this.auth.redirectByRole();
        } else {
          this.toast.error(res.message || 'Google login failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(
          err?.error?.errors?.[0] || err?.error?.message || 'Failed to authenticate with Google.'
        );
      }
    });
  }
}