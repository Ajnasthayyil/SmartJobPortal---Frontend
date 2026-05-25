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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  showPass = signal(false);


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
    private ngZone: NgZone
  ) {
    if (this.auth.isLoggedIn()) this.auth.redirectByRole();

    this.form = this.fb.group({
      fullName:    ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/)]],
      email:       ['', [Validators.required, Validators.email, Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{9}$/)]],
      password:    ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
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


    const formVal = this.form.value;
    const req = {
      fullName:    formVal.fullName.trim(),
      email:       formVal.email.trim().toLowerCase(),
      phoneNumber: formVal.phoneNumber.trim(),
      password:    formVal.password,
      role:        Number(formVal.roleId) === 2 ? 'Recruiter' : 'Candidate'
    };

    const registerObs = req.role === 'Recruiter' 
      ? this.auth.registerRecruiter(req) 
      : this.auth.registerCandidate(req);

    registerObs.subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Registration successful! Please sign in.');
          this.router.navigate(['/login']);
        } else {
          this.toast.error(res.message || 'Registration failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(
          err?.error?.message || 'Failed to register account.'
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
    const selectedRole = Number(this.roleId.value) === 2 ? 'Recruiter' : 'Candidate';

    this.auth.googleLogin(idToken, selectedRole).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.toast.success('Google authentication successful!');
          this.auth.redirectByRole();
        } else {
          this.toast.error(res.message || 'Google authentication failed.');
        }
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(
          err?.error?.message || 'Failed to authenticate with Google.'
        );
      }
    });
  }
}