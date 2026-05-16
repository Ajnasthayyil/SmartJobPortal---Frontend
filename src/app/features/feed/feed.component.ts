import { FeedService } from 'src/app/core/services/feed.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  posts: any[] = [];

  postContent = '';
  isModalOpen = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  authService = inject(AuthService);
  router = inject(Router);
  
  constructor(
    private feedService: FeedService
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed() {
    this.feedService.getFeed()
      .subscribe({
        next: (res: any) => {
          this.posts = res.data;
        }
      });
  }

  createPost() {

    if (!this.postContent.trim())
      return;

    const payload = {
      content: this.postContent
    };

    this.feedService.createPost(payload)
      .subscribe({
        next: () => {
          this.postContent = '';
          this.loadFeed();
        }
      });
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }

  closeModal() {
    this.isModalOpen = false;
    this.postContent = '';
    this.selectedFile = null;
    this.imagePreview = null;
    document.body.style.overflow = 'auto';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitPost() {
    if (!this.postContent.trim() && !this.selectedFile) return;

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('content', this.postContent);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.feedService.createPost(formData)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadFeed();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
  }

  navigateToProfile() {
    const role = this.authService.currentUser()?.role;
    if (role === 'Candidate') this.router.navigate(['/candidate/profile']);
    else if (role === 'Recruiter') this.router.navigate(['/recruiter/profile']);
    else if (role === 'Admin') this.router.navigate(['/admin/profile']);
  }
}