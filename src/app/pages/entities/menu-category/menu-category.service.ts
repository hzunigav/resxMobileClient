import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { MenuCategory } from './menu-category.model';

@Injectable({ providedIn: 'root' })
export class MenuCategoryService {
  private resourceUrl = ApiService.API_URL + '/menu-categories';

  constructor(protected http: HttpClient) {}

  create(menuCategory: MenuCategory): Observable<HttpResponse<MenuCategory>> {
    return this.http.post<MenuCategory>(this.resourceUrl, menuCategory, { observe: 'response' });
  }

  update(menuCategory: MenuCategory): Observable<HttpResponse<MenuCategory>> {
    return this.http.put(`${this.resourceUrl}/${menuCategory.id}`, menuCategory, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<MenuCategory>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<MenuCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<MenuCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
