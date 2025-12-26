import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Restaurant } from './restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private resourceUrl = ApiService.API_URL + '/restaurants';

  constructor(protected http: HttpClient) {}

  create(restaurant: Restaurant): Observable<HttpResponse<Restaurant>> {
    return this.http.post<Restaurant>(this.resourceUrl, restaurant, { observe: 'response' });
  }

  update(restaurant: Restaurant): Observable<HttpResponse<Restaurant>> {
    return this.http.put(`${this.resourceUrl}/${restaurant.id}`, restaurant, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Restaurant>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Restaurant[]>> {
    const options = createRequestOption(req);
    return this.http.get<Restaurant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
