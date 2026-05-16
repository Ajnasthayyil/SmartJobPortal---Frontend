import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/core/services/feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  posts: any[] = [];

  postContent = '';

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
}