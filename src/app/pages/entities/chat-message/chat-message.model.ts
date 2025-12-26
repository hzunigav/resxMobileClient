import { BaseEntity } from 'src/model/base-entity';

export class ChatMessage implements BaseEntity {
  constructor(
    public id?: number,
    public messageText?: string,
    public sentAt?: any,
    public readByRecipient?: boolean,
    public serviceundefined?: string,
    public serviceId?: number,
    public senderundefined?: string,
    public senderId?: number,
  ) {
    this.readByRecipient = false;
  }
}
