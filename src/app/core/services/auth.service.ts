import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest, AuthResponse, ApiResponse, UserSession,
  RegisterCandidateRequest, RegisterRecruiterRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Reactive signals for current user state
  currentUser = signal<UserSession | null>(this.loadFromStorage());
  isLoggedIn  = signal<boolean>(!!this.loadFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>
      (`${this.apiUrl}/login`, request).pipe(
        tap(res => {
          if (res.success && res.data && res.data.token) {
            const token = res.data.token;
            const decoded = this.parseJwt(token);
            if (decoded) {
              const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
              const session: UserSession = {
                accessToken: token,
                role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
                email: email,
                userId: parseInt(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '0', 10),
                fullName: email.split('@')[0] || 'User',
                profilePictureUrl: decoded['profilePictureUrl'] || ''
              };
              localStorage.setItem('authToken', token);
              localStorage.setItem('authUser', JSON.stringify(session));
              this.currentUser.set(session);
              this.isLoggedIn.set(true);
            }
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

  uploadPhoto(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ url: string }>>(`${environment.apiUrl}/profile/upload-photo`, formData).pipe(
      tap(res => {
        if (res.success && res.data.url) {
          this.updateSessionPicture(res.data.url);
        }
      })
    );
  }

  private updateSessionPicture(url: string): void {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, profilePictureUrl: url };
      localStorage.setItem('authUser', JSON.stringify(updated));
      this.currentUser.set(updated);
    }
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

  private loadFromStorage(): UserSession | null {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}