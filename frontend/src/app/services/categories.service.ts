import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import {
  CategoryCreate,
  CategoryResponse,
  CategoryType,
  CategoryUpdate
} from '../models/categories.models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByUser(userId: string): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.api}/api/categories/by-user`, {
      params: { userId }
    });
  }

  getByUserType(userId: string, type: CategoryType): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.api}/api/categories/by-user-type`, {
      params: { userId, type }
    });
  }

  create(userId: string, payload: CategoryCreate): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.api}/api/categories`, payload, {
      params: { userId }
    });
  }

  update(id: string, payload: CategoryUpdate): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.api}/api/categories/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/categories/${id}`);
  }
}
