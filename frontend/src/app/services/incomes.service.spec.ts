import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { API_BASE_URL } from '../core/api.config';
import { IncomesService } from './incomes.service';
import { IncomeCreate, IncomeUpdate } from '../models/incomes.models';

describe('IncomesService', () => {
  let service: IncomesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncomesService]
    });
    service = TestBed.inject(IncomesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getByUser calls GET with userId param', () => {
    service.getByUser('u1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/incomes/by-user` &&
      r.params.get('userId') === 'u1'
    );

    req.flush([]);
  });

  it('getByUserDate calls GET with date range params', () => {
    service.getByUserDate('u1', '2026-03-01', '2026-03-31').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/incomes/by-user-date` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('start') === '2026-03-01' &&
      r.params.get('end') === '2026-03-31'
    );

    req.flush([]);
  });

  it('getMonthly calls GET with userId, year, month params', () => {
    service.getMonthly('u1', 2026, 3).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/incomes/monthly` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('year') === '2026' &&
      r.params.get('month') === '3'
    );

    req.flush({ year: 2026, month: 3, total: 100 });
  });

  it('create calls POST with userId param and payload', () => {
    const payload: IncomeCreate = {
      amount: 1000,
      date: '2026-03-24',
      categoryId: 'c1'
    };

    service.create('u1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'POST' &&
      r.url === `${API_BASE_URL}/api/incomes` &&
      r.params.get('userId') === 'u1'
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'i1', ...payload });
  });

  it('update calls PUT with payload', () => {
    const payload: IncomeUpdate = { amount: 1200 };

    service.update('i1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'PUT' &&
      r.url === `${API_BASE_URL}/api/incomes/i1`
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'i1', amount: 1200, date: '2026-03-24' });
  });

  it('delete calls DELETE', () => {
    service.delete('i1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'DELETE' &&
      r.url === `${API_BASE_URL}/api/incomes/i1`
    );

    req.flush(null);
  });
});
