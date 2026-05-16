import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private api = `${environment.apiUrl}/feed`;

  constructor(private http: HttpClient) {}

  getFeed(page = 1) {
    return this.http.get(
      `${this.api}?page=${page}`
    );
  }

  createPost(data: any) {
    return this.http.post(
      this.api,
      data
    );
  }
}