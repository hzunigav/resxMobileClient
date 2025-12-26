import { BaseEntity } from 'src/model/base-entity';

export class Restaurant implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public slug?: string,
    public description?: string,
    public address?: string,
    public phone?: string,
    public email?: string,
    public active?: boolean,
    public logoUrl?: string,
    public createdDate?: any,
    public lastModifiedDate?: any,
    public tenantundefined?: string,
    public tenantId?: number,
  ) {
    this.active = false;
  }
}
