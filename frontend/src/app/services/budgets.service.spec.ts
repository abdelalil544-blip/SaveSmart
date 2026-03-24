import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { API_BASE_URL } from '../core/api.config';
import { BudgetsService } from './budgets.service';
import { BudgetCreate, BudgetUpdate } from '../models/budgets.models';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BudgetsService]
    });
    service = TestBed.inject(BudgetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getByUser calls GET with userId param', () => {
    service.getByUser('u1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/budgets/by-user` &&
      r.params.get('userId') === 'u1'
    );

    req.flush([]);
  });

  it('getByUserMonthYear calls GET with userId, month, year params', () => {
    service.getByUserMonthYear('u1', 3, 2026).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/budgets/by-user-month-year` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('month') === '3' &&
      r.params.get('year') === '2026'
    );

    req.flush({ id: 'b1', budgetAmount: 200, month: 3, year: 2026 });
  });

  it('getByUserCategory calls GET with userId and categoryId params', () => {
    service.getByUserCategory('u1', 'c1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/budgets/by-user-category` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('categoryId') === 'c1'
    );

    req.flush([]);
  });

  it('create calls POST with userId param and payload', () => {
    const payload: BudgetCreate = { budgetAmount: 200, month: 3, year: 2026 };

    service.create('u1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'POST' &&
      r.url === `${API_BASE_URL}/api/budgets` &&
      r.params.get('userId') === 'u1'
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'b1', ...payload });
  });

  it('update calls PUT with payload', () => {
    const payload: BudgetUpdate = { budgetAmount: 220 };

    service.update('b1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'PUT' &&
      r.url === `${API_BASE_URL}/api/budgets/b1`
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'b1', budgetAmount: 220, month: 3, year: 2026 });
  });

  it('delete calls DELETE', () => {
    service.delete('b1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'DELETE' &&
      r.url === `${API_BASE_URL}/api/budgets/b1`
    );

    req.flush(null);
  });
});
