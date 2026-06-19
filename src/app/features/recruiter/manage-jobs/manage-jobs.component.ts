import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobResponse } from '../../../core/models/recruiter.models';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.scss']
})
export class ManageJobsComponent implements OnInit {

  jobs       = signal<JobResponse[]>([]);
  loading    = signal(true);
  activeTab  = signal<'all' | 'active' | 'inactive'>('all');
  confirmId  = signal<number | null>(null);
  searchQuery = signal('');
  
  // Edit Popup State
  isEditModalOpen = signal(false);
  editingJob = signal<any>(null);
  saving = signal(false);

  readonly indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  readonly minDate = new Date().toISOString().split('T')[0];

  filtered = computed(() => {
    let list = this.jobs();
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();

    if (tab === 'active')        list = list.filter(j => j.isActive);
    else if (tab === 'inactive') list = list.filter(j => !j.isActive);

    if (query) {
      list = list.filter(j => 
        j.title.toLowerCase().includes(query) || 
        j.location.toLowerCase().includes(query)
      );
    }
    return list;
  });

  constructor(
    private service: RecruiterService,
    private toast:   ToastService,
    private route:   ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) {
        this.searchQuery.set(params['keyword']);
      } else {
        this.searchQuery.set('');
      }
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getMyJobs().subscribe({
      next: res => {
        if (res.success) {
          this.jobs.set(res.data || []);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyTab(tab: 'all' | 'active' | 'inactive'): void {
    this.activeTab.set(tab);
  }

  count(tab: string): number {
    if (tab === 'active')   return this.jobs().filter(j => j.isActive).length;
    if (tab === 'inactive') return this.jobs().filter(j => !j.isActive).length;
    return this.jobs().length;
  }

  deleteJob(jobId: number): void {
    this.service.deleteJob(jobId).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Job deactivated successfully.');
          this.confirmId.set(null);
          this.load();
        } else {
          this.toast.error(res.message);
        }
      }
    });
  }

  toggleStatus(jobId: number): void {
    const job = this.jobs().find(j => j.jobId === jobId);
    if (job?.isAdminBlocked) {
      this.toast.error('This job is blocked by Admin and cannot be activated.');
      return;
    }

    // Optimistic Update: Instantly flip UI state
    this.jobs.update(jobs => 
      jobs.map(j => j.jobId === jobId ? { ...j, isActive: !j.isActive } : j)
    );
    this.applyTab(this.activeTab()); // Re-apply current filter

    this.service.toggleJobStatus(jobId).subscribe({
      next: res => {
        if (!res.success) {
          // Revert on API reported failure
          this.toast.error(res.message);
          this.load(); 
        } else {
          const msg = job?.isActive ? 'Job successfully deactivated' : 'Job successfully activated';
          this.toast.success(msg);
        }
      },
      error: () => {
        // Revert on HTTP error
        this.toast.error('Failed to communicate with server. Reverting status.');
        this.load();
      }
    });
  }

  openEditModal(job: JobResponse): void {
    // Clone the job to avoid direct binding to the list
    this.editingJob.set({ ...job });
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingJob.set(null);
  }

  saveJobEdit(): void {
    const jobData = this.editingJob();
    if (!jobData) return;

    if (jobData.expiresAt) {
      const selected = new Date(jobData.expiresAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        this.toast.error('Expiry date cannot be in the past.');
        return;
      }
    }

    this.saving.set(true);
    this.service.updateJob(jobData.jobId, jobData).subscribe({
      next: res => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Job updated successfully!');
          this.closeEditModal();
          this.load(); // Refresh list
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to update job.');
      }
    });
  }

  get skillsString(): string {
    return this.editingJob()?.requiredSkills?.join(', ') || '';
  }

  set skillsString(value: string) {
    const job = this.editingJob();
    if (job) {
      job.requiredSkills = value.split(',').map(s => s.trim()).filter(s => s !== '');
    }
  }
}