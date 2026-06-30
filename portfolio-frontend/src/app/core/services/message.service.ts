import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly API = 'http://localhost:5000/api/messages';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  sendMessage(body: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(this.API, body);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.API, { headers: this.authHeaders() });
  }

  markAsRead(id: string): Observable<Message> {
    return this.http.put<Message>(`${this.API}/${id}`, {}, { headers: this.authHeaders() });
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.authHeaders() });
  }
}