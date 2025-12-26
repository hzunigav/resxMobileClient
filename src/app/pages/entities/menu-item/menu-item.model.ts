import { BaseEntity } from 'src/model/base-entity';

export class MenuItem implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public basePrice?: number,
    public imageUrl?: string,
    public active?: boolean,
    public featured?: boolean,
    public availableForBreakfast?: boolean,
    public availableForLunch?: boolean,
    public availableForDinner?: boolean,
    public displayOrder?: number,
    public createdDate?: any,
    public lastModifiedDate?: any,
    public categoryundefined?: string,
    public categoryId?: number,
  ) {
    this.active = false;
    this.featured = false;
    this.availableForBreakfast = false;
    this.availableForLunch = false;
    this.availableForDinner = false;
  }
}
