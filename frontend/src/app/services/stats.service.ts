import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { AnnualStatsResponse, MonthlyStatsResponse } from '../models/stats.models';

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
