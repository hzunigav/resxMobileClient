import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
  menuItem: MenuItem;
  menuItemSize?: any;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  specialInstructions?: string;
  createdAt: string;
  orderItems?: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all orders for a service
   * Epic 5: Used for service closure
   */
  getOrdersForService(serviceId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/services/${serviceId}/orders`);
  }

  /**
   * Confirm an order
   */
  confirmOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/confirm`, {});
  }

  /**
   * Deliver an order
   */
  deliverOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/deliver`, {});
  }

  /**
   * Reject an order
   */
  rejectOrder(orderId: number, reason: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/reject`, { reason });
  }
}
