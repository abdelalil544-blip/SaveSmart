import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { AuthResponse, LoginRequest, RefreshTokenRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/api/auth/login`, payload);
  }

  register(payload: Record<string, unknown>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/api/auth/register`, payload);
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    const payload: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.api}/api/auth/refresh`, payload);
  }

  logout(refreshToken: string): Observable<void> {
    const payload: RefreshTokenRequest = { refreshToken };
    return this.http.post<void>(`${this.api}/api/auth/logout`, payload);
  }
}
