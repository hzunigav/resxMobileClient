import { BaseEntity } from 'src/model/base-entity';

export class ChatMessage implements BaseEntity {
  constructor(
    public id?: number,
    public messageText?: string,
    public content?: string,
    public sentAt?: any,
    public readByRecipient?: boolean,
    public senderType?: string,
    public serviceId?: number,
    public senderId?: number,
  ) {
    this.readByRecipient = false;
  }
}
