import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OrderService } from '#app/pages/entities/order/order.service';
import { Order } from '#app/pages/entities/order/order.model';
import { OrderStatus } from '#app/pages/entities/order/order-status.model';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})
export class OrderStatusPage implements OnInit, OnDestroy {
  orderId: number | null = null;
  order: Order | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  // Polling interval (10 seconds)
  private pollingInterval: any = null;
  private readonly POLLING_INTERVAL_MS = 10000;

  // Order status enum for template
  OrderStatus = OrderStatus;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private navController: NavController
  ) {}

  ngOnInit() {
    // Get order ID from route parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = parseInt(id, 10);
      this.loadOrder();
      this.startPolling();
    } else {
      this.error = 'No order ID provided';
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  /**
   * Load order from backend
   */
  loadOrder(): void {
    if (!this.orderId) {
      return;
    }

    this.orderService.find(this.orderId).subscribe({
      next: response => {
        if (response.body) {
          this.order = response.body;
          this.isLoading = false;
          this.error = null;

          // Stop polling if order is in final state
          if (this.isOrderInFinalState()) {
            this.stopPolling();
          }
        }
      },
      error: err => {
        console.error('Error loading order:', err);
        this.error = 'Failed to load order. Please try again.';
        this.isLoading = false;
        this.stopPolling();
      },
    });
  }

  /**
   * Start polling for order updates
   */
  private startPolling(): void {
    this.pollingInterval = setInterval(() => {
      if (this.orderId && !this.isOrderInFinalState()) {
        this.loadOrder();
      }
    }, this.POLLING_INTERVAL_MS);
  }

  /**
   * Stop polling for order updates
   */
  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Check if order is in a final state (no more updates expected)
   */
  private isOrderInFinalState(): boolean {
    return (
      this.order?.status === OrderStatus.DELIVERED ||
      this.order?.status === OrderStatus.REJECTED
    );
  }

  /**
   * Manually refresh order
   */
  doRefresh(event: any): void {
    this.loadOrder();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  /**
   * Navigate back to home
   */
  goToHome(): void {
    this.navController.navigateRoot('/tabs/home');
  }

  /**
   * Get status display text
   */
  getStatusDisplayText(): string {
    switch (this.order?.status) {
      case OrderStatus.PENDING:
        return 'Order Received';
      case OrderStatus.CONFIRMED:
        return 'Order Confirmed';
      case OrderStatus.PREPARING:
        return 'Being Prepared';
      case OrderStatus.DELIVERED:
        return 'Delivered';
      case OrderStatus.REJECTED:
        return 'Order Rejected';
      default:
        return 'Unknown Status';
    }
  }

  /**
   * Get status icon name
   */
  getStatusIcon(): string {
    switch (this.order?.status) {
      case OrderStatus.PENDING:
        return 'time-outline';
      case OrderStatus.CONFIRMED:
        return 'checkmark-circle-outline';
      case OrderStatus.PREPARING:
        return 'restaurant-outline';
      case OrderStatus.DELIVERED:
        return 'checkmark-done-circle';
      case OrderStatus.REJECTED:
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  /**
   * Get status color
   */
  getStatusColor(): string {
    switch (this.order?.status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.CONFIRMED:
        return 'primary';
      case OrderStatus.PREPARING:
        return 'secondary';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.REJECTED:
        return 'danger';
      default:
        return 'medium';
    }
  }

  /**
   * Check if status is active in timeline
   */
  isStatusActive(status: OrderStatus): boolean {
    if (!this.order) {
      return false;
    }

    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.DELIVERED,
    ];

    const currentIndex = statusOrder.indexOf(this.order.status as OrderStatus);
    const checkIndex = statusOrder.indexOf(status);

    return checkIndex <= currentIndex;
  }
}
