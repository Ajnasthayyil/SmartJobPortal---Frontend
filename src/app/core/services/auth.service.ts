import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest, AuthResponse, ApiResponse,
  RegisterCandidateRequest, RegisterRecruiterRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Reactive signals for current user state
  currentUser = signal<AuthResponse | null>(this.loadFromStorage());
  isLoggedIn  = signal<boolean>(!!this.loadFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>
      (`${this.apiUrl}/login`, request).pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('authToken', res.data.accessToken);
            localStorage.setItem('authUser',  JSON.stringify(res.data));
            this.currentUser.set(res.data);
            this.isLoggedIn.set(true);
          }
        })
      );
  }

  registerCandidate(req: RegisterCandidateRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>
      (`${this.apiUrl}/register`, { ...req, role: 'Candidate' });
  }

  registerRecruiter(req: RegisterRecruiterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>
      (`${this.apiUrl}/register`, { ...req, role: 'Recruiter' });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return this.currentUser()?.role ?? null;
  }

  redirectByRole(): void {
    const role = this.getRole();
    if      (role === 'Admin')     this.router.navigate(['/admin/dashboard']);
    else if (role === 'Recruiter') this.router.navigate(['/recruiter/dashboard']);
    else if (role === 'Candidate') this.router.navigate(['/candidate/dashboard']);
    else                           this.router.navigate(['/login']);
  }

  private loadFromStorage(): AuthResponse | null {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  }
}