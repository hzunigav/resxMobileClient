import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { TableComponentsPage, TableDetailPage, TableUpdatePage } from '../../../support/pages/entities/table/table.po';
import tableSample from './table.json';

describe('Table entity', () => {
  const COMPONENT_TITLE = 'Tables';
  const SUBCOMPONENT_TITLE = 'Table';

  const tablePageUrl = '/tabs/entities/table';
  const tableApiUrl = '/api/tables';

  const tableComponentsPage = new TableComponentsPage();
  const tableUpdatePage = new TableUpdatePage();
  const tableDetailPage = new TableDetailPage();

  let table: any;

  beforeEach(() => {
    table = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Tables page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      tableComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', tablePageUrl);

      tableComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Table page and go back', () => {
      cy.visit(tablePageUrl);
      tableComponentsPage.clickOnCreateButton();

      tableUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      tableUpdatePage.back();
      cy.url().should('include', tablePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: tableApiUrl,
        body: tableSample,
      }).then(({ body }) => {
        table = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${tableApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [table],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (table) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${tableApiUrl}/${table.id}`,
        }).then(() => {
          table = undefined;
        });
      }
    });

    it('should open Table view, open Table edit and go back', () => {
      cy.visit(tablePageUrl);
      tableComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      tableDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (table.tableNumber !== undefined && table.tableNumber !== null) {
        tableDetailPage.getTableNumberContent().contains(table.tableNumber);
      }
      if (table.capacity !== undefined && table.capacity !== null) {
        tableDetailPage.getCapacityContent().contains(table.capacity);
      }
      if (table.qrCodeUrl !== undefined && table.qrCodeUrl !== null) {
        tableDetailPage.getQrCodeUrlContent().contains(table.qrCodeUrl);
      }
      if (table.qrToken !== undefined && table.qrToken !== null) {
        tableDetailPage.getQrTokenContent().contains(table.qrToken);
      }
      tableDetailPage.edit();

      tableUpdatePage.back();
      tableDetailPage.back();
      cy.url().should('include', tablePageUrl);
    });

    it('should open Table view, open Table edit and save', () => {
      cy.visit(tablePageUrl);
      tableComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      tableDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      tableDetailPage.edit();

      tableUpdatePage.save();
      cy.url().should('include', tablePageUrl);
    });

    it('should delete Table', () => {
      cy.visit(tablePageUrl);
      tableComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      tableDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      tableComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      table = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: tableApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (table) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${tableApiUrl}/${table.id}`,
        }).then(() => {
          table = undefined;
        });
      }
    });

    it('should create Table', () => {
      cy.visit(tablePageUrl + '/new');

      tableUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (tableSample.tableNumber !== undefined && tableSample.tableNumber !== null) {
        tableUpdatePage.setTableNumberInput(tableSample.tableNumber);
      }
      if (tableSample.capacity !== undefined && tableSample.capacity !== null) {
        tableUpdatePage.setCapacityInput(tableSample.capacity);
      }
      if (tableSample.qrCodeUrl !== undefined && tableSample.qrCodeUrl !== null) {
        tableUpdatePage.setQrCodeUrlInput(tableSample.qrCodeUrl);
      }
      if (tableSample.qrToken !== undefined && tableSample.qrToken !== null) {
        tableUpdatePage.setQrTokenInput(tableSample.qrToken);
      }
      if (tableSample.active !== undefined && tableSample.active !== null) {
        tableUpdatePage.setActiveInput(tableSample.active);
      }
      tableUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        table = body;
      });

      tableComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
