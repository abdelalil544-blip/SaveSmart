import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { API_BASE_URL } from '../core/api.config';
import { ExpensesService } from './expenses.service';
import { ExpenseCreate, ExpenseUpdate } from '../models/expenses.models';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpensesService]
    });
    service = TestBed.inject(ExpensesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getByUser calls GET with userId param', () => {
    service.getByUser('u1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/expenses/by-user` &&
      r.params.get('userId') === 'u1'
    );

    req.flush([]);
  });

  it('getByUserDate calls GET with date range params', () => {
    service.getByUserDate('u1', '2026-03-01', '2026-03-31').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/expenses/by-user-date` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('start') === '2026-03-01' &&
      r.params.get('end') === '2026-03-31'
    );

    req.flush([]);
  });

  it('create calls POST with userId param and payload', () => {
    const payload: ExpenseCreate = {
      amount: 10,
      date: '2026-03-24',
      categoryId: 'c1'
    };

    service.create('u1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'POST' &&
      r.url === `${API_BASE_URL}/api/expenses` &&
      r.params.get('userId') === 'u1'
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'e1', ...payload });
  });

  it('update calls PUT with payload', () => {
    const payload: ExpenseUpdate = { amount: 12 };

    service.update('e1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'PUT' &&
      r.url === `${API_BASE_URL}/api/expenses/e1`
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'e1', amount: 12, date: '2026-03-24' });
  });

  it('delete calls DELETE', () => {
    service.delete('e1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'DELETE' &&
      r.url === `${API_BASE_URL}/api/expenses/e1`
    );

    req.flush(null);
  });
});
