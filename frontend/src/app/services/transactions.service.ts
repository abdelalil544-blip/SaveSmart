import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api.config';
import { PagedResponse, TransactionResponse } from '../models/transactions.models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private api = API_BASE_URL;

    constructor(private http: HttpClient) { }

    getTransactions(userId: string, page: number = 0, size: number = 10): Observable<PagedResponse<TransactionResponse>> {
        return this.http.get<PagedResponse<TransactionResponse>>(`${this.api}/api/transactions`, {
            params: { userId, page: page.toString(), size: size.toString() }
        });
    }
}
