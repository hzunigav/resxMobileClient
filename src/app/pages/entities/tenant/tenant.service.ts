import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Tenant } from './tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private resourceUrl = ApiService.API_URL + '/tenants';

  constructor(protected http: HttpClient) {}

  create(tenant: Tenant): Observable<HttpResponse<Tenant>> {
    return this.http.post<Tenant>(this.resourceUrl, tenant, { observe: 'response' });
  }

  update(tenant: Tenant): Observable<HttpResponse<Tenant>> {
    return this.http.put(`${this.resourceUrl}/${tenant.id}`, tenant, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Tenant>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Tenant[]>> {
    const options = createRequestOption(req);
    return this.http.get<Tenant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
