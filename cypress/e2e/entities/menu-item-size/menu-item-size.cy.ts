import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  MenuItemSizeComponentsPage,
  MenuItemSizeDetailPage,
  MenuItemSizeUpdatePage,
} from '../../../support/pages/entities/menu-item-size/menu-item-size.po';
import menuItemSizeSample from './menu-item-size.json';

describe('MenuItemSize entity', () => {
  const COMPONENT_TITLE = 'Menu Item Sizes';
  const SUBCOMPONENT_TITLE = 'Menu Item Size';

  const menuItemSizePageUrl = '/tabs/entities/menu-item-size';
  const menuItemSizeApiUrl = '/api/menu-item-sizes';

  const menuItemSizeComponentsPage = new MenuItemSizeComponentsPage();
  const menuItemSizeUpdatePage = new MenuItemSizeUpdatePage();
  const menuItemSizeDetailPage = new MenuItemSizeDetailPage();

  let menuItemSize: any;

  beforeEach(() => {
    menuItemSize = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load MenuItemSizes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      menuItemSizeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', menuItemSizePageUrl);

      menuItemSizeComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create MenuItemSize page and go back', () => {
      cy.visit(menuItemSizePageUrl);
      menuItemSizeComponentsPage.clickOnCreateButton();

      menuItemSizeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      menuItemSizeUpdatePage.back();
      cy.url().should('include', menuItemSizePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: menuItemSizeApiUrl,
        body: menuItemSizeSample,
      }).then(({ body }) => {
        menuItemSize = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${menuItemSizeApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [menuItemSize],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (menuItemSize) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuItemSizeApiUrl}/${menuItemSize.id}`,
        }).then(() => {
          menuItemSize = undefined;
        });
      }
    });

    it('should open MenuItemSize view, open MenuItemSize edit and go back', () => {
      cy.visit(menuItemSizePageUrl);
      menuItemSizeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemSizeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (menuItemSize.sizeName !== undefined && menuItemSize.sizeName !== null) {
        menuItemSizeDetailPage.getSizeNameContent().contains(menuItemSize.sizeName);
      }
      if (menuItemSize.price !== undefined && menuItemSize.price !== null) {
        menuItemSizeDetailPage.getPriceContent().contains(menuItemSize.price);
      }
      if (menuItemSize.displayOrder !== undefined && menuItemSize.displayOrder !== null) {
        menuItemSizeDetailPage.getDisplayOrderContent().contains(menuItemSize.displayOrder);
      }
      menuItemSizeDetailPage.edit();

      menuItemSizeUpdatePage.back();
      menuItemSizeDetailPage.back();
      cy.url().should('include', menuItemSizePageUrl);
    });

    it('should open MenuItemSize view, open MenuItemSize edit and save', () => {
      cy.visit(menuItemSizePageUrl);
      menuItemSizeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemSizeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      menuItemSizeDetailPage.edit();

      menuItemSizeUpdatePage.save();
      cy.url().should('include', menuItemSizePageUrl);
    });

    it('should delete MenuItemSize', () => {
      cy.visit(menuItemSizePageUrl);
      menuItemSizeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemSizeDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      menuItemSizeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      menuItemSize = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: menuItemSizeApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (menuItemSize) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuItemSizeApiUrl}/${menuItemSize.id}`,
        }).then(() => {
          menuItemSize = undefined;
        });
      }
    });

    it('should create MenuItemSize', () => {
      cy.visit(menuItemSizePageUrl + '/new');

      menuItemSizeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (menuItemSizeSample.sizeName !== undefined && menuItemSizeSample.sizeName !== null) {
        menuItemSizeUpdatePage.setSizeNameInput(menuItemSizeSample.sizeName);
      }
      if (menuItemSizeSample.price !== undefined && menuItemSizeSample.price !== null) {
        menuItemSizeUpdatePage.setPriceInput(menuItemSizeSample.price);
      }
      if (menuItemSizeSample.displayOrder !== undefined && menuItemSizeSample.displayOrder !== null) {
        menuItemSizeUpdatePage.setDisplayOrderInput(menuItemSizeSample.displayOrder);
      }
      if (menuItemSizeSample.active !== undefined && menuItemSizeSample.active !== null) {
        menuItemSizeUpdatePage.setActiveInput(menuItemSizeSample.active);
      }
      menuItemSizeUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        menuItemSize = body;
      });

      menuItemSizeComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
