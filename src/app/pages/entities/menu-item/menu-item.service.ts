import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { MenuItem } from './menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuItemService {
  private resourceUrl = ApiService.API_URL + '/menu-items';

  constructor(protected http: HttpClient) {}

  create(menuItem: MenuItem): Observable<HttpResponse<MenuItem>> {
    return this.http.post<MenuItem>(this.resourceUrl, menuItem, { observe: 'response' });
  }

  update(menuItem: MenuItem): Observable<HttpResponse<MenuItem>> {
    return this.http.put(`${this.resourceUrl}/${menuItem.id}`, menuItem, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<MenuItem>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<MenuItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<MenuItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
