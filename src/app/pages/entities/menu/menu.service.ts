import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Menu } from './menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private resourceUrl = ApiService.API_URL + '/menus';

  constructor(protected http: HttpClient) {}

  create(menu: Menu): Observable<HttpResponse<Menu>> {
    return this.http.post<Menu>(this.resourceUrl, menu, { observe: 'response' });
  }

  update(menu: Menu): Observable<HttpResponse<Menu>> {
    return this.http.put(`${this.resourceUrl}/${menu.id}`, menu, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Menu>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Menu[]>> {
    const options = createRequestOption(req);
    return this.http.get<Menu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
