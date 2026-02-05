import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import {
  GoalProgressResponse,
  GoalStatus,
  SavingGoalCreate,
  SavingGoalResponse,
  SavingGoalUpdate
} from '../models/saving-goals.models';

@Injectable({ providedIn: 'root' })
export class SavingGoalsService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByUser(userId: string): Observable<SavingGoalResponse[]> {
    return this.http.get<SavingGoalResponse[]>(`${this.api}/api/saving-goals/by-user`, {
      params: { userId }
    });
  }

  getByUserStatus(userId: string, status: GoalStatus): Observable<SavingGoalResponse[]> {
    return this.http.get<SavingGoalResponse[]>(`${this.api}/api/saving-goals/by-user-status`, {
      params: { userId, status }
    });
  }

  getProgress(id: string): Observable<GoalProgressResponse> {
    return this.http.get<GoalProgressResponse>(`${this.api}/api/saving-goals/${id}/progress`);
  }

  create(userId: string, payload: SavingGoalCreate): Observable<SavingGoalResponse> {
    return this.http.post<SavingGoalResponse>(`${this.api}/api/saving-goals`, payload, {
      params: { userId }
    });
  }

  update(id: string, payload: SavingGoalUpdate): Observable<SavingGoalResponse> {
    return this.http.put<SavingGoalResponse>(`${this.api}/api/saving-goals/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/saving-goals/${id}`);
  }
}
