import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly API = 'http://localhost:5000/api/profile';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.API);
  }

  updateProfile(formData: FormData): Observable<Profile> {
    return this.http.put<Profile>(this.API, formData, {
      headers: this.authHeaders()
    });
  }
}