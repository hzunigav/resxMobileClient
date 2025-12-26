import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '#app/services/cart/cart.service';
import { CartItem, CartSummary } from '#app/services/cart/cart.model';

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
    private navController: NavController
  ) {}

  ngOnInit() {
    // Subscribe to cart items
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items;
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
   * Increment item quantity
   */
  incrementQuantity(cartItem: CartItem): void {
    this.cartService.updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  /**
   * Decrement item quantity
   */
  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartService.updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else {
      // If quantity would be 0, remove item
      this.removeItem(cartItem);
    }
  }

  /**
   * Remove item from cart (called by swipe-to-delete)
   */
  removeItem(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.id);
  }

  /**
   * Update special instructions for an item
   */
  updateInstructions(cartItem: CartItem, instructions: string): void {
    this.cartService.updateSpecialInstructions(cartItem.id, instructions);
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }

  /**
   * Navigate to order confirmation page
   */
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      return;
    }
    this.navController.navigateForward('/order-confirmation');
  }

  /**
   * Navigate back
   */
  goBack(): void {
    this.navController.back();
  }

  /**
   * Check if cart is empty
   */
  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}
