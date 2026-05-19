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
  uploadedImage: any = null;

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

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; 
  }

  closeModal() {
    this.isModalOpen = false;
    this.postContent = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadedImage = null;
    document.body.style.overflow = 'auto';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // 1. Local Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      // 2. Upload to Cloudinary (via Backend)
      this.feedService.uploadImage(file).subscribe({
        next: (res: any) => {
          this.uploadedImage = res;
        },
        error: (err) => console.error('Image upload failed', err)
      });
    }
  }

  submitPost() {
    if (!this.postContent.trim() && !this.uploadedImage) return;

    this.isSubmitting = true;
    const payload = {
      userId: this.authService.currentUser()?.userId,
      content: this.postContent,
      images: this.uploadedImage ? [this.uploadedImage] : []
    };

    this.feedService.createPost(payload)
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

  react(postId: number, type: string) {

  this.feedService
    .reactToPost(postId, type)
    .subscribe({
      next: () => {
        this.loadFeed();
      }
    });
}
}