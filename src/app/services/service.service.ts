import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ServiceCheck {
  serviceId: number;
  tableNumber: string;
  restaurantName: string;
  orders: any[];
  subtotal: number;
  tax: number;
  total: number;
  closedAt: string;
  customerName?: string;
  serverName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  /**
   * Get service check/bill details
   * Epic 5: Closure & Reporting
   */
  getCheck(serviceId: number): Observable<ServiceCheck> {
    return this.http.get<ServiceCheck>(`${this.apiUrl}/${serviceId}/check`);
  }

  /**
   * Close a service (server only)
   * Epic 5: Closure & Reporting
   */
  closeService(serviceId: number, request?: any): Observable<ServiceCheck> {
    return this.http.put<ServiceCheck>(`${this.apiUrl}/${serviceId}/close`, request || {});
  }
}
