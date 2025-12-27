import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Order, CreateOrderFromCartDTO } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private resourceUrl = ApiService.API_URL + '/orders';

  constructor(protected http: HttpClient) {}

  create(order: Order): Observable<HttpResponse<Order>> {
    return this.http.post<Order>(this.resourceUrl, order, { observe: 'response' });
  }

  /**
   * Create an order from cart items
   * @param serviceId The service ID (hardcoded to 1 for MVP)
   * @param orderData The cart items and special instructions
   */
  createFromCart(orderData: CreateOrderFromCartDTO): Observable<HttpResponse<Order>> {
    return this.http.post<Order>(`${this.resourceUrl}/from-cart`, orderData, { observe: 'response' });
  }

  update(order: Order): Observable<HttpResponse<Order>> {
    return this.http.put(`${this.resourceUrl}/${order.id}`, order, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Order>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Order[]>> {
    const options = createRequestOption(req);
    return this.http.get<Order[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  /**
   * Confirm an order (Server action)
   */
  confirm(id: number): Observable<HttpResponse<Order>> {
    return this.http.put<Order>(`${this.resourceUrl}/${id}/confirm`, {}, { observe: 'response' });
  }

  /**
   * Mark order as delivered (Server action)
   */
  deliver(id: number): Observable<HttpResponse<Order>> {
    return this.http.put<Order>(`${this.resourceUrl}/${id}/deliver`, {}, { observe: 'response' });
  }

  /**
   * Reject an order (Server action)
   */
  reject(id: number, reason: string): Observable<HttpResponse<Order>> {
    return this.http.put<Order>(`${this.resourceUrl}/${id}/reject`, { reason }, { observe: 'response' });
  }
}
