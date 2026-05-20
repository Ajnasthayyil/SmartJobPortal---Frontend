import { FeedService } from 'src/app/core/services/feed.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';

export interface FeedComment {
  postCommentId: number;
  userId?: number;
  userName: string;
  content: string;
  createdAt: string;
  replies?: any[];
}

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

  isReactionsModalOpen = false;
  postReactions: any[] = [];
  loadingReactions = false;

  isCommentsModalOpen = false;
  activePostForComments: any = null;
  loadingCommentsModal = false;

  activePostMenuId: number | null = null;
  editingPostId: number | null = null;
  editingPostContent = '';

  editingCommentId: number | null = null;
  editingCommentContent = '';

  pendingDeletePostId: number | null = null;
  pendingDeleteCommentId: number | null = null;
  pendingDeleteCommentPostId: number | null = null;

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);
  
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
          this.posts = res.data.map((p: any) => ({
             ...p,
             isLiked: p.currentUserReaction === 'Like'
          }));
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
    if (!this.isReactionsModalOpen) document.body.style.overflow = 'auto';
  }

  openReactionsModal(postId: number) {
    this.isReactionsModalOpen = true;
    this.loadingReactions = true;
    document.body.style.overflow = 'hidden';
    
    this.feedService.getPostReactions(postId).subscribe({
      next: (res: any) => {
        // Our controller returns a list directly
        this.postReactions = res;
        this.loadingReactions = false;
      },
      error: () => {
        this.loadingReactions = false;
      }
    });
  }

  closeReactionsModal() {
    this.isReactionsModalOpen = false;
    this.postReactions = [];
    if (!this.isModalOpen && !this.isCommentsModalOpen) document.body.style.overflow = 'auto';
  }

  openCommentsModal(post: any) {
    this.activePostForComments = post;
    this.isCommentsModalOpen = true;
    this.loadingCommentsModal = true;
    document.body.style.overflow = 'hidden';

    // Fetch comments for this post
    this.feedService.getComments(post.postId).subscribe({
      next: (res: any) => {
        this.commentsMap[post.postId] = res.data || res; // Handle both wrapped and unwrapped arrays
        this.loadingCommentsModal = false;
        setTimeout(() => {
          const input = document.querySelector('.modal-input-wrapper input') as HTMLInputElement;
          if (input) input.focus();
        }, 100);
      },
      error: () => {
        this.loadingCommentsModal = false;
      }
    });
  }

  closeCommentsModal() {
    this.isCommentsModalOpen = false;
    this.activePostForComments = null;
    if (!this.isModalOpen && !this.isReactionsModalOpen) document.body.style.overflow = 'auto';
  }

  viewPublicProfile(userId: number) {
    // In a real app, you'd navigate to the user's public profile
    // this.router.navigate(['/profile', userId]);
    alert('Public profile viewing for User ID ' + userId + ' is not fully implemented yet!');
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
    const post = this.posts.find(p => p.postId === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    }

    this.feedService
      .reactToPost(postId, type)
      .subscribe({
        next: () => {
          // Silent background update if needed, but local state is already toggled!
        }
      });
  }

  commentsMap: { [key: number]: FeedComment[] } = {};

  commentInputs: { [key: number]: string } = {};
  replyInputs: { [commentId: number]: string } = {};
  activeReplyCommentId: number | null = null;

  toggleReplyInput(commentId: number) {
    this.activeReplyCommentId = this.activeReplyCommentId === commentId ? null : commentId;
  }

loadComments(postId: number) {

  this.feedService
    .getComments(postId)
    .subscribe({
      next: (res) => {
        this.commentsMap[postId] = res;
      }
    });
}

addComment(postId: number, parentCommentId?: number) {
  const content = parentCommentId 
    ? this.replyInputs[parentCommentId] 
    : this.commentInputs[postId];

  if (!content || !content.trim()) return;

  const payload: any = { content };
  if (parentCommentId) {
    payload.parentCommentId = parentCommentId;
  }

  this.feedService
    .addComment(postId, payload)
    .subscribe({
      next: () => {
        if (parentCommentId) {
          this.replyInputs[parentCommentId] = '';
          this.activeReplyCommentId = null;
        } else {
          this.commentInputs[postId] = '';
          // Update total comments count
          const post = this.posts.find(p => p.postId === postId);
          if (post) post.totalComments = (post.totalComments || post.commentsCount || 0) + 1;
        }
        
        this.loadComments(postId); // Refresh comments inline and in modal
        if (!parentCommentId) {
            this.loadFeed();
        }
      }
    });
}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.more-btn') && !target.closest('.post-menu-dropdown')) {
      this.activePostMenuId = null;
    }
  }

  togglePostMenu(postId: number, event: MouseEvent) {
    event.stopPropagation();
    this.activePostMenuId = this.activePostMenuId === postId ? null : postId;
  }

  deletePost(postId: number) {
    this.pendingDeletePostId = postId;
    this.pendingDeleteCommentId = null;
    this.pendingDeleteCommentPostId = null;
    this.activePostMenuId = null;
  }

  startEditPost(post: any) {
    this.editingPostId = post.postId;
    this.editingPostContent = post.content;
    this.activePostMenuId = null;
  }

  cancelEditPost() {
    this.editingPostId = null;
    this.editingPostContent = '';
  }

  saveEditPost() {
    if (!this.editingPostContent.trim()) return;

    this.feedService.editPost(this.editingPostId!, { content: this.editingPostContent }).subscribe({
      next: () => {
        this.toast.success('Post updated successfully');
        this.cancelEditPost();
        this.loadFeed();
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || 'Failed to update post');
      }
    });
  }

  deleteComment(commentId: number, postId: number) {
    this.pendingDeleteCommentId = commentId;
    this.pendingDeleteCommentPostId = postId;
    this.pendingDeletePostId = null;
  }

  cancelPendingDelete() {
    this.pendingDeletePostId = null;
    this.pendingDeleteCommentId = null;
    this.pendingDeleteCommentPostId = null;
  }

  confirmPendingDelete() {
    if (this.pendingDeletePostId !== null) {
      const postId = this.pendingDeletePostId;
      this.cancelPendingDelete();
      this.feedService.deletePost(postId).subscribe({
        next: () => {
          this.toast.success('Post deleted successfully');
          this.loadFeed();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message || 'Failed to delete post');
        }
      });
    } else if (this.pendingDeleteCommentId !== null) {
      const commentId = this.pendingDeleteCommentId;
      const postId = this.pendingDeleteCommentPostId!;
      this.cancelPendingDelete();
      this.feedService.deleteComment(commentId).subscribe({
        next: () => {
          this.toast.success('Comment deleted successfully');
          this.loadComments(postId);
          const post = this.posts.find(p => p.postId === postId);
          if (post) {
            post.totalComments = Math.max(0, (post.totalComments || post.commentsCount || 1) - 1);
          }
          this.loadFeed();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message || 'Failed to delete comment');
        }
      });
    }
  }

  startEditComment(comment: any) {
    this.editingCommentId = comment.postCommentId;
    this.editingCommentContent = comment.content;
  }

  cancelEditComment() {
    this.editingCommentId = null;
    this.editingCommentContent = '';
  }

  saveEditComment(postId: number) {
    if (!this.editingCommentContent.trim()) return;

    this.feedService.editComment(this.editingCommentId!, { content: this.editingCommentContent }).subscribe({
      next: () => {
        this.toast.success('Comment updated successfully');
        this.cancelEditComment();
        this.loadComments(postId);
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || 'Failed to update comment');
      }
    });
  }
}