import { BaseEntity } from 'src/model/base-entity';

export class MenuItemSize implements BaseEntity {
  constructor(
    public id?: number,
    public sizeName?: string,
    public price?: number,
    public displayOrder?: number,
    public active?: boolean,
    public menuItemundefined?: string,
    public menuItemId?: number,
  ) {
    this.active = false;
  }
}
