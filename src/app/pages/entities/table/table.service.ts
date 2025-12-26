import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Table } from './table.model';

@Injectable({ providedIn: 'root' })
export class TableService {
  private resourceUrl = ApiService.API_URL + '/tables';

  constructor(protected http: HttpClient) {}

  create(table: Table): Observable<HttpResponse<Table>> {
    return this.http.post<Table>(this.resourceUrl, table, { observe: 'response' });
  }

  update(table: Table): Observable<HttpResponse<Table>> {
    return this.http.put(`${this.resourceUrl}/${table.id}`, table, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Table>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Table[]>> {
    const options = createRequestOption(req);
    return this.http.get<Table[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
