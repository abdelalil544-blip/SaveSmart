import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { API_BASE_URL } from '../core/api.config';
import { CategoriesService } from './categories.service';
import { CategoryCreate, CategoryType, CategoryUpdate } from '../models/categories.models';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriesService]
    });
    service = TestBed.inject(CategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getByUser calls GET with userId param', () => {
    service.getByUser('u1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/categories/by-user` &&
      r.params.get('userId') === 'u1'
    );

    req.flush([]);
  });

  it('getByUserType calls GET with userId and type params', () => {
    service.getByUserType('u1', 'EXPENSE' as CategoryType).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'GET' &&
      r.url === `${API_BASE_URL}/api/categories/by-user-type` &&
      r.params.get('userId') === 'u1' &&
      r.params.get('type') === 'EXPENSE'
    );

    req.flush([]);
  });

  it('create calls POST with userId param and payload', () => {
    const payload: CategoryCreate = { name: 'Food', type: 'EXPENSE' };

    service.create('u1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'POST' &&
      r.url === `${API_BASE_URL}/api/categories` &&
      r.params.get('userId') === 'u1'
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'c1', ...payload });
  });

  it('update calls PUT with payload', () => {
    const payload: CategoryUpdate = { name: 'Bills' };

    service.update('c1', payload).subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'PUT' &&
      r.url === `${API_BASE_URL}/api/categories/c1`
    );

    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'c1', name: 'Bills', type: 'EXPENSE' });
  });

  it('delete calls DELETE', () => {
    service.delete('c1').subscribe();

    const req = httpMock.expectOne(r =>
      r.method === 'DELETE' &&
      r.url === `${API_BASE_URL}/api/categories/c1`
    );

    req.flush(null);
  });
});
