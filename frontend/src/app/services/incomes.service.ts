import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';

export interface IncomeCreate {
  amount: number;
  date: string;
  description?: string;
  categoryId: string;
}

export interface IncomeUpdate {
  amount?: number;
  date?: string;
  description?: string;
  categoryId?: string;
}

export interface IncomeResponse {
  id: string;
  amount: number;
  date: string;
  description?: string;
  categoryId?: string;
  userId?: string;
}

export interface MonthlyIncomeResponse {
  year: number;
  month: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class IncomesService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByUser(userId: string): Observable<IncomeResponse[]> {
    return this.http.get<IncomeResponse[]>(`${this.api}/api/incomes/by-user`, {
      params: { userId }
    });
  }

  getByUserDate(userId: string, start: string, end: string): Observable<IncomeResponse[]> {
    return this.http.get<IncomeResponse[]>(`${this.api}/api/incomes/by-user-date`, {
      params: { userId, start, end }
    });
  }

  getMonthly(userId: string, year: number, month: number): Observable<MonthlyIncomeResponse> {
    return this.http.get<MonthlyIncomeResponse>(`${this.api}/api/incomes/monthly`, {
      params: { userId, year, month }
    });
  }

  create(userId: string, payload: IncomeCreate): Observable<IncomeResponse> {
    return this.http.post<IncomeResponse>(`${this.api}/api/incomes`, payload, {
      params: { userId }
    });
  }

  update(id: string, payload: IncomeUpdate): Observable<IncomeResponse> {
    return this.http.put<IncomeResponse>(`${this.api}/api/incomes/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/incomes/${id}`);
  }
}
