import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { PagedResponse, TransactionResponse } from '../models/transactions.models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private api = API_BASE_URL;

    constructor(private http: HttpClient) { }

    getTransactions(userId: string, page: number = 0, size: number = 10, startDate?: string, endDate?: string): Observable<PagedResponse<TransactionResponse>> {
        let params = new HttpParams()
            .set('userId', userId)
            .set('page', page.toString())
            .set('size', size.toString());
        if (startDate && endDate) {
            params = params.set('startDate', startDate).set('endDate', endDate);
        }
        return this.http.get<PagedResponse<TransactionResponse>>(`${this.api}/api/transactions`, { params });
    }
}
