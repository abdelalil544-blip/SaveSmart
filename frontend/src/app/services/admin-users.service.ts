import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { UserResponse, UserUpdate, UserStats } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private api = API_BASE_URL;

  list(query?: string): Observable<UserResponse[]> {
    const params = query ? { query } : undefined;
    return this.http.get<UserResponse[]>(`${this.api}/api/admin/users`, { params });
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.api}/api/admin/users/${id}`);
  }

  getStats(id: string): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.api}/api/admin/users/${id}/stats`);
  }

  update(id: string, payload: UserUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.api}/api/admin/users/${id}`, payload);
  }

  resetPassword(id: string, password: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.api}/api/admin/users/${id}/reset-password`, { password });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/admin/users/${id}`);
  }
}
