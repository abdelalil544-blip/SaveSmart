import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { UserResponse, UserUpdate } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private api = API_BASE_URL;

    getById(id: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.api}/api/users/${id}`);
    }

    update(id: string, payload: UserUpdate): Observable<UserResponse> {
        return this.http.put<UserResponse>(`${this.api}/api/users/${id}`, payload);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/api/users/${id}`);
    }
}
