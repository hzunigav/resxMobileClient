import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ChatMessageComponentsPage,
  ChatMessageDetailPage,
  ChatMessageUpdatePage,
} from '../../../support/pages/entities/chat-message/chat-message.po';
import chatMessageSample from './chat-message.json';

describe('ChatMessage entity', () => {
  const COMPONENT_TITLE = 'Chat Messages';
  const SUBCOMPONENT_TITLE = 'Chat Message';

  const chatMessagePageUrl = '/tabs/entities/chat-message';
  const chatMessageApiUrl = '/api/chat-messages';

  const chatMessageComponentsPage = new ChatMessageComponentsPage();
  const chatMessageUpdatePage = new ChatMessageUpdatePage();
  const chatMessageDetailPage = new ChatMessageDetailPage();

  let chatMessage: any;

  beforeEach(() => {
    chatMessage = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ChatMessages page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      chatMessageComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', chatMessagePageUrl);

      chatMessageComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ChatMessage page and go back', () => {
      cy.visit(chatMessagePageUrl);
      chatMessageComponentsPage.clickOnCreateButton();

      chatMessageUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      chatMessageUpdatePage.back();
      cy.url().should('include', chatMessagePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: chatMessageApiUrl,
        body: chatMessageSample,
      }).then(({ body }) => {
        chatMessage = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${chatMessageApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [chatMessage],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (chatMessage) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${chatMessageApiUrl}/${chatMessage.id}`,
        }).then(() => {
          chatMessage = undefined;
        });
      }
    });

    it('should open ChatMessage view, open ChatMessage edit and go back', () => {
      cy.visit(chatMessagePageUrl);
      chatMessageComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      chatMessageDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (chatMessage.messageText !== undefined && chatMessage.messageText !== null) {
        chatMessageDetailPage.getMessageTextContent().contains(chatMessage.messageText);
      }
      chatMessageDetailPage.edit();

      chatMessageUpdatePage.back();
      chatMessageDetailPage.back();
      cy.url().should('include', chatMessagePageUrl);
    });

    it('should open ChatMessage view, open ChatMessage edit and save', () => {
      cy.visit(chatMessagePageUrl);
      chatMessageComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      chatMessageDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      chatMessageDetailPage.edit();

      chatMessageUpdatePage.save();
      cy.url().should('include', chatMessagePageUrl);
    });

    it('should delete ChatMessage', () => {
      cy.visit(chatMessagePageUrl);
      chatMessageComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      chatMessageDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      chatMessageComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      chatMessage = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: chatMessageApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (chatMessage) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${chatMessageApiUrl}/${chatMessage.id}`,
        }).then(() => {
          chatMessage = undefined;
        });
      }
    });

    it('should create ChatMessage', () => {
      cy.visit(chatMessagePageUrl + '/new');

      chatMessageUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (chatMessageSample.messageText !== undefined && chatMessageSample.messageText !== null) {
        chatMessageUpdatePage.setMessageTextInput(chatMessageSample.messageText);
      }
      if (chatMessageSample.sentAt !== undefined && chatMessageSample.sentAt !== null) {
        chatMessageUpdatePage.setSentAtInput(chatMessageSample.sentAt);
      }
      if (chatMessageSample.readByRecipient !== undefined && chatMessageSample.readByRecipient !== null) {
        chatMessageUpdatePage.setReadByRecipientInput(chatMessageSample.readByRecipient);
      }
      chatMessageUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        chatMessage = body;
      });

      chatMessageComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
