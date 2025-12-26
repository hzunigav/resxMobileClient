import { BaseEntity } from 'src/model/base-entity';

export interface Service {
  id?: number;
  status?: string;
}

export interface User {
  id?: number;
  login?: string;
}

export class ChatMessage implements BaseEntity {
  constructor(
    public id?: number,
    public messageText?: string,
    public sentAt?: string,
    public readByRecipient?: boolean,
    public service?: Service,
    public sender?: User,
  ) {
    this.readByRecipient = false;
  }
}
