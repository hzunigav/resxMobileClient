import { BaseEntity } from 'src/model/base-entity';

export const enum ServiceStatus {
  'INITIATED',
  'ACTIVE',
  'COMPLETED',
}

export class Service implements BaseEntity {
  constructor(
    public id?: number,
    public status?: ServiceStatus,
    public initiatedAt?: any,
    public acknowledgedAt?: any,
    public completedAt?: any,
    public restaurantundefined?: string,
    public restaurantId?: number,
    public tableundefined?: string,
    public tableId?: number,
    public customerundefined?: string,
    public customerId?: number,
    public serverundefined?: string,
    public serverId?: number,
  ) {}
}
