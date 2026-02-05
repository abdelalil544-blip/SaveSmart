import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';

export interface MonthlyStatsResponse {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
}

export interface AnnualStatsResponse {
  year: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  budgetTotal: number;
  budgetRemaining: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getMonthly(userId: string, year: number, month: number): Observable<MonthlyStatsResponse> {
    return this.http.get<MonthlyStatsResponse>(`${this.api}/api/stats/monthly`, {
      params: { userId, year, month }
    });
  }

  getAnnual(userId: string, year: number): Observable<AnnualStatsResponse> {
    return this.http.get<AnnualStatsResponse>(`${this.api}/api/stats/annual`, {
      params: { userId, year }
    });
  }
}
