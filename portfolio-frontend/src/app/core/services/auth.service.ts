import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginCredentials, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api';
  private readonly TOKEN_KEY = 'admin_token';

  isLoggedIn = signal<boolean>(this.hasToken());  // Signal tracks the login state based on the presence of a token

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, credentials).pipe(    //pipe lets you perform extra operations on the response before returning it to the subscriber
      tap(res => {          // tap lets you perform other checks with the response without changing it
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);        // !! converts to boolean
  }
}