import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CandidateProfile, JobListItem, MatchScoreResponse,
  ApplicationTracking, SkillItem
} from '../models/candidate.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  private readonly api = `${environment.apiUrl}/candidate`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<CandidateProfile>> {
    return this.http.get<ApiResponse<CandidateProfile>>(`${this.api}/profile`);
  }

  updateProfile(data: Partial<CandidateProfile> & { skills: any[] }):
    Observable<ApiResponse<CandidateProfile>> {
    return this.http.put<ApiResponse<CandidateProfile>>(`${this.api}/profile`, data);
  }

  uploadResume(file: File): Observable<ApiResponse<string>> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.api}/resume`, form);
  }

  searchJobs(filters: any): Observable<ApiResponse<{ jobs: JobListItem[], totalCount: number }>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] !== null && filters[k] !== undefined && filters[k] !== '')
        params = params.set(k, filters[k]);
    });
    return this.http.get<ApiResponse<any>>(`${this.api}/jobs`, { params });
  }

  getJobDetail(jobId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.api}/jobs/${jobId}`);
  }

  applyJob(jobId: number, coverNote?: string): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>
      (`${this.api}/jobs/apply`, { jobId, coverNote });
  }

  getApplications(): Observable<ApiResponse<ApplicationTracking[]>> {
    return this.http.get<ApiResponse<ApplicationTracking[]>>
      (`${this.api}/applications`);
  }

  getMatchScore(jobId: number): Observable<ApiResponse<MatchScoreResponse>> {
    return this.http.get<ApiResponse<MatchScoreResponse>>
      (`${this.api}/jobs/${jobId}/match-score`);
  }

  getCompanies(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/companies`);
  }
}