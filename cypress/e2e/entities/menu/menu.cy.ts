import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { MenuComponentsPage, MenuDetailPage, MenuUpdatePage } from '../../../support/pages/entities/menu/menu.po';
import menuSample from './menu.json';

describe('Menu entity', () => {
  const COMPONENT_TITLE = 'Menus';
  const SUBCOMPONENT_TITLE = 'Menu';

  const menuPageUrl = '/tabs/entities/menu';
  const menuApiUrl = '/api/menus';

  const menuComponentsPage = new MenuComponentsPage();
  const menuUpdatePage = new MenuUpdatePage();
  const menuDetailPage = new MenuDetailPage();

  let menu: any;

  beforeEach(() => {
    menu = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Menus page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      menuComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', menuPageUrl);

      menuComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Menu page and go back', () => {
      cy.visit(menuPageUrl);
      menuComponentsPage.clickOnCreateButton();

      menuUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      menuUpdatePage.back();
      cy.url().should('include', menuPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: menuApiUrl,
        body: menuSample,
      }).then(({ body }) => {
        menu = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${menuApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [menu],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (menu) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuApiUrl}/${menu.id}`,
        }).then(() => {
          menu = undefined;
        });
      }
    });

    it('should open Menu view, open Menu edit and go back', () => {
      cy.visit(menuPageUrl);
      menuComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (menu.name !== undefined && menu.name !== null) {
        menuDetailPage.getNameContent().contains(menu.name);
      }
      if (menu.description !== undefined && menu.description !== null) {
        menuDetailPage.getDescriptionContent().contains(menu.description);
      }
      menuDetailPage.edit();

      menuUpdatePage.back();
      menuDetailPage.back();
      cy.url().should('include', menuPageUrl);
    });

    it('should open Menu view, open Menu edit and save', () => {
      cy.visit(menuPageUrl);
      menuComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      menuDetailPage.edit();

      menuUpdatePage.save();
      cy.url().should('include', menuPageUrl);
    });

    it('should delete Menu', () => {
      cy.visit(menuPageUrl);
      menuComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      menuComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      menu = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: menuApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (menu) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuApiUrl}/${menu.id}`,
        }).then(() => {
          menu = undefined;
        });
      }
    });

    it('should create Menu', () => {
      cy.visit(menuPageUrl + '/new');

      menuUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (menuSample.name !== undefined && menuSample.name !== null) {
        menuUpdatePage.setNameInput(menuSample.name);
      }
      if (menuSample.description !== undefined && menuSample.description !== null) {
        menuUpdatePage.setDescriptionInput(menuSample.description);
      }
      if (menuSample.active !== undefined && menuSample.active !== null) {
        menuUpdatePage.setActiveInput(menuSample.active);
      }
      if (menuSample.createdDate !== undefined && menuSample.createdDate !== null) {
        menuUpdatePage.setCreatedDateInput(menuSample.createdDate);
      }
      if (menuSample.lastModifiedDate !== undefined && menuSample.lastModifiedDate !== null) {
        menuUpdatePage.setLastModifiedDateInput(menuSample.lastModifiedDate);
      }
      menuUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        menu = body;
      });

      menuComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
