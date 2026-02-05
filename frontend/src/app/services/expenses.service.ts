import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';

export interface ExpenseCreate {
  amount: number;
  date: string;
  description?: string;
  note?: string;
  categoryId: string;
}

export interface ExpenseUpdate {
  amount?: number;
  date?: string;
  description?: string;
  note?: string;
  categoryId?: string;
}

export interface ExpenseResponse {
  id: string;
  amount: number;
  date: string;
  description?: string;
  note?: string;
  categoryId?: string;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private api = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByUser(userId: string): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(`${this.api}/api/expenses/by-user`, {
      params: { userId }
    });
  }

  getByUserDate(userId: string, start: string, end: string): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(`${this.api}/api/expenses/by-user-date`, {
      params: { userId, start, end }
    });
  }

  create(userId: string, payload: ExpenseCreate): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(`${this.api}/api/expenses`, payload, {
      params: { userId }
    });
  }

  update(id: string, payload: ExpenseUpdate): Observable<ExpenseResponse> {
    return this.http.put<ExpenseResponse>(`${this.api}/api/expenses/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/api/expenses/${id}`);
  }
}
