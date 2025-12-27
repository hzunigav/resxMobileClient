import { BaseEntity } from 'src/model/base-entity';
import { OrderStatus } from './order-status.model';

export class Order implements BaseEntity {
  constructor(
    public id?: number,
    public orderNumber?: string,
    public status?: OrderStatus,
    public subtotal?: number,
    public tax?: number,
    public total?: number,
    public specialInstructions?: string,
    public createdAt?: string,
    public confirmedAt?: string,
    public preparingAt?: string,
    public deliveredAt?: string,
    public rejectedAt?: string,
    public rejectionReason?: string,
    public orderItems?: any[],
    public serviceId?: number,
    public createdById?: number,
    public createdByLogin?: string,
    public confirmedById?: number,
    public confirmedByLogin?: string,
    public deliveredById?: number,
    public deliveredByLogin?: string,
  ) {
    this.status = OrderStatus.PENDING;
  }
}

// DTO for creating order from cart (matches backend CreateOrderRequest)
export interface CreateOrderFromCartDTO {
  serviceId: number;
  items: CartItemDTO[];
  specialInstructions?: string;
}

export interface CartItemDTO {
  menuItemId: number;
  menuItemSizeId?: number;
  quantity: number;
  specialInstructions?: string;
}
