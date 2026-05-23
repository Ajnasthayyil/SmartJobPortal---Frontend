import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRFeedService {
  private hubConnection: signalR.HubConnection | null = null;

  // Subjects for emitting real-time events
  public newPostReceived$ = new Subject<any>();
  public newCommentReceived$ = new Subject<{ comment: any, postId: number }>();
  public reactionUpdated$ = new Subject<{ postId: number, newLikesCount: number }>();

  constructor() {}

  public startConnection(token: string) {
    // Determine the hub URL by replacing /api with /hubs/feed if needed,
    // or just using the base URL + /hubs/feed.
    // Assuming environment.apiUrl is like "http://localhost:5246/api"
    let baseUrl = environment.apiUrl.replace('/api', '');
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/feed`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR FeedHub connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.addListeners();
  }

  private addListeners() {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveNewPost', (post: any) => {
      this.newPostReceived$.next(post);
    });

    this.hubConnection.on('ReceiveNewComment', (comment: any, postId: number) => {
      this.newCommentReceived$.next({ comment, postId });
    });

    this.hubConnection.on('ReceiveReactionUpdate', (postId: number, newLikesCount: number) => {
      this.reactionUpdated$.next({ postId, newLikesCount });
    });
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
