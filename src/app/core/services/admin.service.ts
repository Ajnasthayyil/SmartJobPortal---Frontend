import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminDashboard, UserListItem, RecruiterApproval
} from '../models/admin.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ApiResponse<AdminDashboard>> {
    return this.http.get<ApiResponse<AdminDashboard>>(`${this.api}/dashboard`);
  }

  getUsers(role?: string, isActive?: boolean): Observable<ApiResponse<UserListItem[]>> {
    let params = new HttpParams();
    if (role !== undefined) params = params.set('role', role);
    if (isActive !== undefined) params = params.set('isActive', isActive.toString());
    return this.http.get<ApiResponse<UserListItem[]>>(`${this.api}/users`, { params });
  }

  blockUser(userId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/users/${userId}/block`, {});
  }

  unblockUser(userId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/users/${userId}/unblock`, {});
  }

  getPendingRecruiters(): Observable<ApiResponse<RecruiterApproval[]>> {
    return this.http.get<ApiResponse<RecruiterApproval[]>>
      (`${this.api}/recruiters/pending`);
  }

  getAllRecruiters(): Observable<ApiResponse<RecruiterApproval[]>> {
    return this.http.get<ApiResponse<RecruiterApproval[]>>
      (`${this.api}/recruiters`);
  }

  approveRecruiter(userId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/recruiters/${userId}/approve`, {});
  }

  rejectRecruiter(userId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/recruiters/${userId}/reject`, {});
  }

  getAllJobs(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/jobs`);
  }

  deactivateJob(jobId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/jobs/${jobId}/deactivate`, {});
  }

  getProfile(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.api}/profile`);
  }

  updateProfile(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/profile`, data);
  }
}