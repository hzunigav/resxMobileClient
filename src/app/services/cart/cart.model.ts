import { MenuItem } from '#app/pages/entities/menu-item/menu-item.model';

export interface CartItem {
  id: string; // Unique identifier for cart item (generated)
  menuItem: MenuItem;
  menuItemSizeId?: number;
  menuItemSizeName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
