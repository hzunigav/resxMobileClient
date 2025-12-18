import { BaseEntity } from 'src/model/base-entity';

export class Tenant implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public slug?: string,
    public active?: boolean,
    public createdDate?: any,
    public lastModifiedDate?: any,
  ) {
    this.active = false;
  }
}
