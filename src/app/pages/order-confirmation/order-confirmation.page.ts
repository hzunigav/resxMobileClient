import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '#app/services/cart/cart.service';
import { OrderService } from '#app/pages/entities/order/order.service';
import { CartItem, CartSummary } from '#app/services/cart/cart.model';
import { CreateOrderFromCartDTO } from '#app/pages/entities/order/order.model';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.page.html',
  styleUrls: ['./order-confirmation.page.scss'],
})
export class OrderConfirmationPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  };
  orderSpecialInstructions: string = '';
  isSubmitting: boolean = false;

  // Hardcoded for MVP (will be retrieved from QR scan in Epic 3)
  private readonly SERVICE_ID = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Subscribe to cart items
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items;

      // Redirect back to cart if empty
      if (items.length === 0) {
        this.navController.navigateBack('/cart');
      }
    });

    // Subscribe to cart summary
    this.cartService.getCartSummary$().pipe(takeUntil(this.destroy$)).subscribe(summary => {
      this.cartSummary = summary;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Submit order to backend
   */
  async placeOrder(): Promise<void> {
    if (this.cartItems.length === 0) {
      await this.showAlert('Error', 'Your cart is empty.');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingController.create({
      message: 'Placing your order...',
    });
    await loading.present();

    try {
      // Build order DTO from cart items
      const orderDTO: CreateOrderFromCartDTO = {
        items: this.cartItems.map(item => ({
          menuItemId: item.menuItem.id!,
          menuItemSizeId: item.menuItemSizeId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        specialInstructions: this.orderSpecialInstructions || undefined,
      };

      // Call backend API
      const response = await this.orderService
        .createFromCart(this.SERVICE_ID, orderDTO)
        .toPromise();

      await loading.dismiss();

      if (response && response.body) {
        const order = response.body;

        // Clear cart
        this.cartService.clearCart();

        // Show success message
        await this.showAlert(
          'Order Placed!',
          `Your order #${order.orderNumber} has been placed successfully.`
        );

        // Navigate to order status page
        this.navController.navigateForward(`/order-status/${order.id}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      await loading.dismiss();
      console.error('Error placing order:', error);

      await this.showAlert(
        'Error',
        'Failed to place order. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Navigate back to cart
   */
  goBack(): void {
    this.navController.back();
  }

  /**
   * Show alert dialog
   */
  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
