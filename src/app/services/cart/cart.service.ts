import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary } from './cart.model';
import { MenuItem } from '#app/pages/entities/menu-item/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly TAX_RATE = 0.08; // 8% tax rate (configurable)

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    // Note: Cart persistence skipped for MVP (will clear on app reload)
  }

  /**
   * Add item to cart or update quantity if already exists
   */
  addToCart(
    menuItem: MenuItem,
    quantity: number = 1,
    menuItemSizeId?: number,
    menuItemSizeName?: string,
    specialInstructions?: string,
    unitPrice?: number,
  ): void {
    const currentItems = this.cartItemsSubject.value;
    // Use provided unitPrice or fall back to menuItem.basePrice
    const itemPrice = unitPrice ?? menuItem.basePrice ?? 0;


    // Check if item already exists (same menu item + size)
    const existingItemIndex = currentItems.findIndex(
      item =>
        item.menuItem.id === menuItem.id &&
        item.menuItemSizeId === menuItemSizeId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal =
        updatedItems[existingItemIndex].unitPrice * updatedItems[existingItemIndex].quantity;

      // Update special instructions if provided
      if (specialInstructions) {
        updatedItems[existingItemIndex].specialInstructions = specialInstructions;
      }

      this.cartItemsSubject.next(updatedItems);
    } else {
      // Add new item
      
      const newItem: CartItem = {
        id: this.generateCartItemId(),
        menuItem,
        menuItemSizeId,
        menuItemSizeName,
        quantity,
        unitPrice: itemPrice,
        subtotal: itemPrice * quantity,
        specialInstructions,
      };

      this.cartItemsSubject.next([...currentItems, newItem]);
    }
  }

  /**
   * Remove item from cart by cart item ID
   */
  removeFromCart(cartItemId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== cartItemId);
    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Update quantity of a cart item
   */
  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          subtotal: item.unitPrice * quantity,
        };
      }
      return item;
    });

    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Update special instructions for a cart item
   */
  updateSpecialInstructions(cartItemId: string, specialInstructions: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === cartItemId) {
        return { ...item, specialInstructions };
      }
      return item;
    });

    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  /**
   * Get observable of cart item count
   */
  getCartCount$(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  /**
   * Get observable of cart summary (subtotal, tax, total)
   */
  getCartSummary$(): Observable<CartSummary> {
    return this.cartItems$.pipe(
      map(items => {
        const itemCount = items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
        const tax = subtotal * this.TAX_RATE;
        const total = subtotal + tax;

        return {
          itemCount,
          subtotal: this.roundToTwo(subtotal),
          tax: this.roundToTwo(tax),
          total: this.roundToTwo(total),
        };
      })
    );
  }

  /**
   * Get current cart items (non-observable)
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Generate unique cart item ID
   */
  private generateCartItemId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Round number to 2 decimal places
   */
  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
