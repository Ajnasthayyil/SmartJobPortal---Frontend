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
  uploadImage(file: File) {

  const formData = new FormData();

  formData.append('file', file);

  return this.http.post(
    `${environment.apiUrl}/media/upload`,
    formData
  );
}

reactToPost(postId: number, reactionType: string) {

  return this.http.post(
    `${environment.apiUrl}/feed/${postId}/react`,
    {
      reactionType
    }
  );
}

getComments(postId: number) {

  return this.http.get<any[]>(
    `${environment.apiUrl}/feed/${postId}/comments`
  );
}

addComment(
  postId: number,
  payload: any
) {

  return this.http.post(
    `${environment.apiUrl}/feed/${postId}/comments`,
    payload
  );
}

}