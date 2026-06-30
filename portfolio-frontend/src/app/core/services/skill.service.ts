import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillCategory } from '../models/skill.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private readonly API = 'http://localhost:5000/api/skills';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getSkills(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>(this.API);
  }

  createSkill(body: Partial<SkillCategory>): Observable<SkillCategory> {
    return this.http.post<SkillCategory>(this.API, body, { headers: this.authHeaders() });
  }

  updateSkill(id: string, body: Partial<SkillCategory>): Observable<SkillCategory> {
    return this.http.put<SkillCategory>(`${this.API}/${id}`, body, { headers: this.authHeaders() });
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.authHeaders() });
  }
}