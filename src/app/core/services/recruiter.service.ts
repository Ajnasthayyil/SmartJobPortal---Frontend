import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecruiterProfile, PostJobRequest, JobResponse, ApplicantResponse
} from '../models/recruiter.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class RecruiterService {
  private readonly api = `${environment.apiUrl}/recruiter`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<RecruiterProfile>> {
    return this.http.get<ApiResponse<RecruiterProfile>>(`${this.api}/profile`);
  }

  updateProfile(data: Partial<RecruiterProfile>): Observable<ApiResponse<RecruiterProfile>> {
    return this.http.put<ApiResponse<RecruiterProfile>>(`${this.api}/profile`, data);
  }

  postJob(data: PostJobRequest): Observable<ApiResponse<JobResponse>> {
    return this.http.post<ApiResponse<JobResponse>>(`${this.api}/jobs`, data);
  }

  getMyJobs(): Observable<ApiResponse<JobResponse[]>> {
    return this.http.get<ApiResponse<JobResponse[]>>(`${this.api}/jobs`);
  }

  updateJob(jobId: number, data: any): Observable<ApiResponse<JobResponse>> {
    return this.http.put<ApiResponse<JobResponse>>(`${this.api}/jobs/${jobId}`, data);
  }

  deleteJob(jobId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.api}/jobs/${jobId}`);
  }

  toggleJobStatus(jobId: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(`${this.api}/jobs/${jobId}/toggle-status`, {});
  }

  getApplicants(jobId: number): Observable<ApiResponse<ApplicantResponse[]>> {
    return this.http.get<ApiResponse<ApplicantResponse[]>>
      (`${this.api}/jobs/${jobId}/applicants`);
  }

  getRankedApplicants(jobId: number): Observable<ApiResponse<ApplicantResponse[]>> {
    return this.http.get<ApiResponse<ApplicantResponse[]>>
      (`${this.api}/jobs/${jobId}/ranking`);
  }

  updateStatus(applicationId: number, status: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>
      (`${this.api}/applications/${applicationId}/status`, { status });
  }
}