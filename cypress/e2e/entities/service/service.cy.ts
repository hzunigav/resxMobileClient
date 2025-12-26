import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { ServiceComponentsPage, ServiceDetailPage, ServiceUpdatePage } from '../../../support/pages/entities/service/service.po';
import serviceSample from './service.json';

describe('Service entity', () => {
  const COMPONENT_TITLE = 'Services';
  const SUBCOMPONENT_TITLE = 'Service';

  const servicePageUrl = '/tabs/entities/service';
  const serviceApiUrl = '/api/services';

  const serviceComponentsPage = new ServiceComponentsPage();
  const serviceUpdatePage = new ServiceUpdatePage();
  const serviceDetailPage = new ServiceDetailPage();

  let service: any;

  beforeEach(() => {
    service = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Services page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      serviceComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', servicePageUrl);

      serviceComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Service page and go back', () => {
      cy.visit(servicePageUrl);
      serviceComponentsPage.clickOnCreateButton();

      serviceUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      serviceUpdatePage.back();
      cy.url().should('include', servicePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: serviceApiUrl,
        body: serviceSample,
      }).then(({ body }) => {
        service = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${serviceApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [service],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (service) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${serviceApiUrl}/${service.id}`,
        }).then(() => {
          service = undefined;
        });
      }
    });

    it('should open Service view, open Service edit and go back', () => {
      cy.visit(servicePageUrl);
      serviceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      serviceDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      serviceDetailPage.edit();

      serviceUpdatePage.back();
      serviceDetailPage.back();
      cy.url().should('include', servicePageUrl);
    });

    it('should open Service view, open Service edit and save', () => {
      cy.visit(servicePageUrl);
      serviceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      serviceDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      serviceDetailPage.edit();

      serviceUpdatePage.save();
      cy.url().should('include', servicePageUrl);
    });

    it('should delete Service', () => {
      cy.visit(servicePageUrl);
      serviceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      serviceDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      serviceComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      service = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: serviceApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (service) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${serviceApiUrl}/${service.id}`,
        }).then(() => {
          service = undefined;
        });
      }
    });

    it('should create Service', () => {
      cy.visit(servicePageUrl + '/new');

      serviceUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (serviceSample.status !== undefined && serviceSample.status !== null) {
        serviceUpdatePage.setStatusInput(serviceSample.status);
      }
      if (serviceSample.initiatedAt !== undefined && serviceSample.initiatedAt !== null) {
        serviceUpdatePage.setInitiatedAtInput(serviceSample.initiatedAt);
      }
      if (serviceSample.acknowledgedAt !== undefined && serviceSample.acknowledgedAt !== null) {
        serviceUpdatePage.setAcknowledgedAtInput(serviceSample.acknowledgedAt);
      }
      if (serviceSample.completedAt !== undefined && serviceSample.completedAt !== null) {
        serviceUpdatePage.setCompletedAtInput(serviceSample.completedAt);
      }
      serviceUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        service = body;
      });

      serviceComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
