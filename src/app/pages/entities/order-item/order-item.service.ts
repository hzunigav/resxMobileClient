import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { OrderItem } from './order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderItemService {
  private resourceUrl = ApiService.API_URL + '/order-items';

  constructor(protected http: HttpClient) {}

  create(orderItem: OrderItem): Observable<HttpResponse<OrderItem>> {
    return this.http.post<OrderItem>(this.resourceUrl, orderItem, { observe: 'response' });
  }

  update(orderItem: OrderItem): Observable<HttpResponse<OrderItem>> {
    return this.http.put(`${this.resourceUrl}/${orderItem.id}`, orderItem, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<OrderItem>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<OrderItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<OrderItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
