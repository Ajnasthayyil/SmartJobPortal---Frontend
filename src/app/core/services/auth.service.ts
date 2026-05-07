import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';
import {
  LoginRequest, AuthResponse, ApiResponse, UserSession,
  RegisterCandidateRequest, RegisterRecruiterRequest
} from '../models/auth.models';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Reactive signals for current user state
  currentUser = signal<UserSession | null>(this.loadFromStorage());
  isLoggedIn  = signal<boolean>(!!this.loadFromStorage());

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
    private notifications: NotificationService
  ) {
    if (this.isLoggedIn()) {
      this.notifications.startPolling();
    }
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>
      (`${this.apiUrl}/login`, request, { withCredentials: true }).pipe(
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
              this.notifications.startPolling(); 

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
    // Call the backend to clear cookies before clearing local storage
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
    
  }

  private clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.toast.info('Logged out successfully.');
    this.notifications.stopPolling();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => {
        if (res.success && res.data && res.data.token) {
          const token = res.data.token;
          localStorage.setItem('authToken', token);
          const current = this.currentUser();
          if (current) {
            const updated = { ...current, accessToken: token };
            localStorage.setItem('authUser', JSON.stringify(updated));
            this.currentUser.set(updated);
          }
        }
      })
    );
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
    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'Recruiter') {
      this.router.navigate(['/recruiter/dashboard']);
    } else if (role === 'Candidate') {
      // For candidates, check if profile is complete (headline and summary are good indicators)
      this.http.get<ApiResponse<any>>(`${environment.apiUrl}/candidate/profile`).subscribe({
        next: res => {
          if (res.success && res.data) {
            const p = res.data;
            const isComplete = p.headline && p.summary && p.skills?.length > 0;
            if (isComplete) {
              this.router.navigate(['/candidate/dashboard']);
            } else {
              this.router.navigate(['/candidate/profile']);
            }
          } else {
            this.router.navigate(['/candidate/profile']);
          }
        },
        error: () => this.router.navigate(['/candidate/profile'])
      });
    } else {
      this.router.navigate(['/login']);
    }
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