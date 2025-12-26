import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ChatMessageComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-chat-message';
}

export class ChatMessageUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-chat-message-update';

  setMessageTextInput(messageText: string) {
    this.setInputValue('messageText', messageText);
  }

  setSentAtInput(sentAt: string) {
    this.setDateTime('sentAt', sentAt);
  }

  setReadByRecipientInput(readByRecipient: string) {
    this.setBoolean('readByRecipient', readByRecipient);
  }
}

export class ChatMessageDetailPage extends EntityDetailPage {
  pageSelector = 'page-chat-message-detail';

  getMessageTextContent() {
    return cy.get('#messageText-content');
  }

  getSentAtContent() {
    return cy.get('#sentAt-content');
  }

  getReadByRecipientContent() {
    return cy.get('#readByRecipient-content');
  }
}
