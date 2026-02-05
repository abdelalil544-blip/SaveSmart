import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';

export interface BudgetCreate {
  budgetAmount: number;
  month: number;
  year: number;
  categoryId?: string;
  isGlobal?: boolean;
}

export interface BudgetUpdate {
  budgetAmount?: number;
  month?: number;
  year?: number;
  categoryId?: string;
  isGlobal?: boolean;
}

export interface BudgetResponse {
  id: string;
  budgetAmount: number;
  month: number;
  year: number;
  categoryId?: string;
  isGlobal?: boolean;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByUser(userId: string): Observable<BudgetResponse[]> {
    return this.http.get<BudgetResponse[]>(`${this.api}/api/budgets/by-user`, {
      params: { userId }
    });
  }

  getByUserMonthYear(userId: string, month: number, year: number): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(`${this.api}/api/budgets/by-user-month-year`, {
      params: { userId, month, year }
    });
  }

  getByUserCategory(userId: string, categoryId: string): Observable<BudgetResponse[]> {
    return this.http.get<BudgetResponse[]>(`${this.api}/api/budgets/by-user-category`, {
      params: { userId, categoryId }
    });
  }

  create(userId: string, payload: BudgetCreate): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.api}/api/budgets`, payload, {
      params: { userId }
    });
  }

  update(id: string, payload: BudgetUpdate): Observable<BudgetResponse> {
    return this.http.put<BudgetResponse>(`${this.api}/api/budgets/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/budgets/${id}`);
  }
}
