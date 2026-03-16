import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { AdminOverviewStats } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  private http = inject(HttpClient);
  private api = API_BASE_URL;

  getOverview(): Observable<AdminOverviewStats> {
    return this.http.get<AdminOverviewStats>(`${this.api}/api/admin/stats/overview`);
  }
}
