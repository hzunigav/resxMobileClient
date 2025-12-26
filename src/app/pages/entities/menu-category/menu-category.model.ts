import { BaseEntity } from 'src/model/base-entity';

export class MenuCategory implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public displayOrder?: number,
    public active?: boolean,
    public createdDate?: any,
    public lastModifiedDate?: any,
    public menuundefined?: string,
    public menuId?: number,
  ) {
    this.active = false;
  }
}
