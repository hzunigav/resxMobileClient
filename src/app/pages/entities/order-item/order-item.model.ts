import { BaseEntity } from 'src/model/base-entity';

export class OrderItem implements BaseEntity {
  constructor(
    public id?: number,
    public quantity?: number,
    public unitPrice?: number,
    public subtotal?: number,
    public specialInstructions?: string,
    public orderId?: number,
    public menuItemId?: number,
    public menuItemName?: string,
    public menuItemSizeId?: number,
    public menuItemSizeName?: string,
  ) {}
}
