import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { MenuItemSize } from './menu-item-size.model';

@Injectable({ providedIn: 'root' })
export class MenuItemSizeService {
  private resourceUrl = ApiService.API_URL + '/menu-item-sizes';

  constructor(protected http: HttpClient) {}

  create(menuItemSize: MenuItemSize): Observable<HttpResponse<MenuItemSize>> {
    return this.http.post<MenuItemSize>(this.resourceUrl, menuItemSize, { observe: 'response' });
  }

  update(menuItemSize: MenuItemSize): Observable<HttpResponse<MenuItemSize>> {
    return this.http.put(`${this.resourceUrl}/${menuItemSize.id}`, menuItemSize, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<MenuItemSize>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<MenuItemSize[]>> {
    const options = createRequestOption(req);
    return this.http.get<MenuItemSize[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
