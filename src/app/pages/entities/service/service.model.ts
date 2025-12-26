import { BaseEntity } from 'src/model/base-entity';

export const enum ServiceStatus {
  'INITIATED' = 'INITIATED',
  'ACTIVE' = 'ACTIVE',
  'COMPLETED' = 'COMPLETED',
}

export interface Restaurant {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  active?: boolean;
  logoUrl?: string;
}

export interface Table {
  id?: number;
  tableNumber?: string;
  capacity?: number;
  qrCodeUrl?: string;
  qrToken?: string;
  active?: boolean;
}

export interface User {
  id?: number;
  login?: string;
}

export class Service implements BaseEntity {
  constructor(
    public id?: number,
    public status?: ServiceStatus,
    public initiatedAt?: string,
    public acknowledgedAt?: string,
    public completedAt?: string,
    public restaurant?: Restaurant,
    public table?: Table,
    public customer?: User,
    public server?: User,
  ) {}
}
