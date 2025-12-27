import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '#app/services/cart/cart.service';
import { CartItem, CartSummary } from '#app/services/cart/cart.model';
import { OrderService } from '#app/pages/entities/order/order.service';
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

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private navController: NavController,
    private orderService: OrderService,
    private serviceStatusService: ServiceStatusService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getCartSummary$().pipe(takeUntil(this.destroy$)).subscribe(summary => {
      this.cartSummary = summary;
    });
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
      const response = await this.orderService.createFromCart(orderData).toPromise();

      if (response && response.body) {
        this.cartService.clearCart();
        await this.showSuccess('Order submitted successfully!');
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
}
