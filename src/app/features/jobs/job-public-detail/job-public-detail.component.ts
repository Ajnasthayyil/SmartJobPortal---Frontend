import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-job-public-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-public-detail.component.html',
  styleUrls: ['./job-public-detail.component.scss']
})
export class JobPublicDetailComponent implements OnInit {

  job     = signal<any>(null);
  loading = signal(true);
  jobId   = 0;

  constructor(
    private route:  ActivatedRoute,
    private http:   HttpClient,
    public  auth:   AuthService
  ) {}

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<any>(
      `${environment.apiUrl}/candidate/jobs/${this.jobId}`
    ).subscribe({
      next: res => {
        if (res.success) this.job.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}