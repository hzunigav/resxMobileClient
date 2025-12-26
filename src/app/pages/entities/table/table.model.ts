import { BaseEntity } from 'src/model/base-entity';

export class Table implements BaseEntity {
  constructor(
    public id?: number,
    public tableNumber?: string,
    public capacity?: number,
    public qrCodeUrl?: string,
    public qrToken?: string,
    public active?: boolean,
    public restaurantundefined?: string,
    public restaurantId?: number,
  ) {
    this.active = false;
  }
}
