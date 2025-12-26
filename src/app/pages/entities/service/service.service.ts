import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Service } from './service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private resourceUrl = ApiService.API_URL + '/services';

  constructor(protected http: HttpClient) {}

  create(service: Service): Observable<HttpResponse<Service>> {
    return this.http.post<Service>(this.resourceUrl, service, { observe: 'response' });
  }

  update(service: Service): Observable<HttpResponse<Service>> {
    return this.http.put(`${this.resourceUrl}/${service.id}`, service, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Service>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Service[]>> {
    const options = createRequestOption(req);
    return this.http.get<Service[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
