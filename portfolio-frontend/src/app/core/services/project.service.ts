import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API);
  }

  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.API, formData, {
      headers: this.authHeaders()
    });
  }

  updateProject(id: string, formData: FormData): Observable<Project> {    //partial ?? no , must use formdata cuz of file upload
    return this.http.put<Project>(`${this.API}/${id}`, formData, {
      headers: this.authHeaders()
    });
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, {
      headers: this.authHeaders()
    });
  }
}