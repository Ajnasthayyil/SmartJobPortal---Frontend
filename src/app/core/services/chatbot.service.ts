import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatbotNode } from '../models/chatbot.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly api = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  getRootNodes(): Observable<ApiResponse<ChatbotNode[]>> {
    return this.http.get<ApiResponse<ChatbotNode[]>>(`${this.api}/root`);
  }

  getChildNodes(nodeId: number): Observable<ApiResponse<ChatbotNode[]>> {
    return this.http.get<ApiResponse<ChatbotNode[]>>(`${this.api}/children/${nodeId}`);
  }

  searchKeyword(keyword: string): Observable<ApiResponse<ChatbotNode>> {
    return this.http.get<ApiResponse<ChatbotNode>>(`${this.api}/search?keyword=${encodeURIComponent(keyword)}`);
  }
}
