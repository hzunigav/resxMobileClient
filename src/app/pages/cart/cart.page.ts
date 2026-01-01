import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '#app/services/cart/cart.service';
import { CartItem, CartSummary } from '#app/services/cart/cart.model';
import { OrderService as EntityOrderService } from '#app/pages/entities/order/order.service';
import { OrderService, Order } from '#app/services/order.service';
import { ServiceStatusService } from '#app/services/service-status/service-status.service';
import { CreateOrderFromCartDTO } from '#app/pages/entities/order/order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  };
  previousOrders: Order[] = [];
  isLoadingOrders = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private navController: NavController,
    private entityOrderService: EntityOrderService,
    private orderService: OrderService,
    private serviceStatusService: ServiceStatusService,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getCartSummary$().pipe(takeUntil(this.destroy$)).subscribe(summary => {
      this.cartSummary = summary;
    });

    // Load previous orders for the active service
    this.loadPreviousOrders();
  }

  async ngOnDestroy() {
    // Dismiss any open alerts before destroying
    const alert = await this.alertController.getTop();
    if (alert) {
      await alert.dismiss();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartService.updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartService.updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else {
      this.removeItem(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.id);
  }

  updateInstructions(cartItem: CartItem, instructions: string): void {
    this.cartService.updateSpecialInstructions(cartItem.id, instructions);
  }

  async showEditNotesDialog(cartItem: CartItem): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('CART.SPECIAL_INSTRUCTIONS_HEADER'),
      message: this.translate.instant('CART.SPECIAL_INSTRUCTIONS_MESSAGE'),
      inputs: [
        {
          name: 'specialInstructions',
          type: 'textarea',
          placeholder: this.translate.instant('CART.SPECIAL_INSTRUCTIONS_PLACEHOLDER'),
          value: cartItem.specialInstructions || '',
          attributes: {
            maxlength: 200,
          },
        },
      ],
      buttons: [
        {
          text: this.translate.instant('CANCEL_BUTTON'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('CART.SAVE'),
          handler: (data) => {
            const instructions = data.specialInstructions?.trim() || '';
            this.cartService.updateSpecialInstructions(cartItem.id, instructions);
          },
        },
      ],
    });

    await alert.present();
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }

  async proceedToCheckout(): Promise<void> {
    if (this.cartItems.length === 0) {
      return;
    }

    const serviceId = this.serviceStatusService.getActiveServiceId();
    if (!serviceId) {
      await this.showError('No active service found. Please start a service first.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Order',
      message: `Place order for ${this.cartSummary.itemCount} item(s) totaling $${this.cartSummary.total.toFixed(2)}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: async () => {
            await alert.dismiss();
            await this.submitOrder(serviceId);
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  private async submitOrder(serviceId: number): Promise<void> {
    const orderData: CreateOrderFromCartDTO = {
      serviceId,
      items: this.cartItems.map(item => ({
        menuItemId: item.menuItem.id!,
        menuItemSizeId: item.menuItemSizeId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      })),
    };

    try {
      const response = await this.entityOrderService.createFromCart(orderData).toPromise();

      if (response && response.body) {
        this.cartService.clearCart();
        await this.showSuccess('Order submitted successfully!');
        // Reload previous orders to show the newly submitted order
        this.loadPreviousOrders();
        this.navController.navigateBack(`/service/${serviceId}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      await this.showError('Failed to submit order. Please try again.');
    }
  }

  private async showSuccess(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'success',
    });
    await toast.present();
  }

  private async showError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    });
    await toast.present();
  }

  goBack(): void {
    this.navController.back();
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  /**
   * Load previous orders for the active service to show order history
   */
  private loadPreviousOrders(): void {
    const serviceId = this.serviceStatusService.getActiveServiceId();
    if (!serviceId) {
      return;
    }

    this.isLoadingOrders = true;
    this.orderService
      .getOrdersForService(serviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        orders => {
          this.previousOrders = orders || [];
          this.isLoadingOrders = false;
        },
        error => {
          console.error('Error loading previous orders:', error);
          this.isLoadingOrders = false;
        }
      );
  }

  /**
   * Get formatted date/time for order
   */
  getOrderTime(order: Order): string {
    if (!order.createdAt) {
      return '';
    }
    const date = new Date(order.createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Get status badge color based on order status
   */
  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
      case 'PREPARING':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'medium';
    }
  }

  /**
   * Format order status for display
   */
  formatStatus(status: string | undefined): string {
    if (!status) {
      return 'Unknown';
    }
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  /**
   * Check if there are any previous orders
   */
  hasPreviousOrders(): boolean {
    return this.previousOrders.length > 0;
  }

  /**
   * Calculate the grand total of all previous orders
   */
  getGrandTotal(): number {
    return this.previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  }

  /**
   * Get total count of items across all orders
   */
  getTotalItemsCount(): number {
    return this.previousOrders.reduce((sum, order) => {
      const orderItemsCount = order.orderItems?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0;
      return sum + orderItemsCount;
    }, 0);
  }
}
