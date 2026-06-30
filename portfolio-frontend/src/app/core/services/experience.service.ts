import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Experience } from '../models/experience.model';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly API = 'http://localhost:5000/api/experience';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.API);
  }

  createExperience(body: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(this.API, body, { headers: this.authHeaders() });
  }

  updateExperience(id: string, body: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.API}/${id}`, body, { headers: this.authHeaders() });
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.authHeaders() });
  }
}