import { BaseEntity } from 'src/model/base-entity';

export class Menu implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public active?: boolean,
    public createdDate?: any,
    public lastModifiedDate?: any,
    public restaurantundefined?: string,
    public restaurantId?: number,
  ) {
    this.active = false;
  }
}
