import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { MenuItemComponentsPage, MenuItemDetailPage, MenuItemUpdatePage } from '../../../support/pages/entities/menu-item/menu-item.po';
import menuItemSample from './menu-item.json';

describe('MenuItem entity', () => {
  const COMPONENT_TITLE = 'Menu Items';
  const SUBCOMPONENT_TITLE = 'Menu Item';

  const menuItemPageUrl = '/tabs/entities/menu-item';
  const menuItemApiUrl = '/api/menu-items';

  const menuItemComponentsPage = new MenuItemComponentsPage();
  const menuItemUpdatePage = new MenuItemUpdatePage();
  const menuItemDetailPage = new MenuItemDetailPage();

  let menuItem: any;

  beforeEach(() => {
    menuItem = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load MenuItems page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      menuItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', menuItemPageUrl);

      menuItemComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create MenuItem page and go back', () => {
      cy.visit(menuItemPageUrl);
      menuItemComponentsPage.clickOnCreateButton();

      menuItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      menuItemUpdatePage.back();
      cy.url().should('include', menuItemPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: menuItemApiUrl,
        body: menuItemSample,
      }).then(({ body }) => {
        menuItem = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${menuItemApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [menuItem],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (menuItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuItemApiUrl}/${menuItem.id}`,
        }).then(() => {
          menuItem = undefined;
        });
      }
    });

    it('should open MenuItem view, open MenuItem edit and go back', () => {
      cy.visit(menuItemPageUrl);
      menuItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (menuItem.name !== undefined && menuItem.name !== null) {
        menuItemDetailPage.getNameContent().contains(menuItem.name);
      }
      if (menuItem.description !== undefined && menuItem.description !== null) {
        menuItemDetailPage.getDescriptionContent().contains(menuItem.description);
      }
      if (menuItem.basePrice !== undefined && menuItem.basePrice !== null) {
        menuItemDetailPage.getBasePriceContent().contains(menuItem.basePrice);
      }
      if (menuItem.imageUrl !== undefined && menuItem.imageUrl !== null) {
        menuItemDetailPage.getImageUrlContent().contains(menuItem.imageUrl);
      }
      if (menuItem.displayOrder !== undefined && menuItem.displayOrder !== null) {
        menuItemDetailPage.getDisplayOrderContent().contains(menuItem.displayOrder);
      }
      menuItemDetailPage.edit();

      menuItemUpdatePage.back();
      menuItemDetailPage.back();
      cy.url().should('include', menuItemPageUrl);
    });

    it('should open MenuItem view, open MenuItem edit and save', () => {
      cy.visit(menuItemPageUrl);
      menuItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      menuItemDetailPage.edit();

      menuItemUpdatePage.save();
      cy.url().should('include', menuItemPageUrl);
    });

    it('should delete MenuItem', () => {
      cy.visit(menuItemPageUrl);
      menuItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuItemDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      menuItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      menuItem = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: menuItemApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (menuItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuItemApiUrl}/${menuItem.id}`,
        }).then(() => {
          menuItem = undefined;
        });
      }
    });

    it('should create MenuItem', () => {
      cy.visit(menuItemPageUrl + '/new');

      menuItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (menuItemSample.name !== undefined && menuItemSample.name !== null) {
        menuItemUpdatePage.setNameInput(menuItemSample.name);
      }
      if (menuItemSample.description !== undefined && menuItemSample.description !== null) {
        menuItemUpdatePage.setDescriptionInput(menuItemSample.description);
      }
      if (menuItemSample.basePrice !== undefined && menuItemSample.basePrice !== null) {
        menuItemUpdatePage.setBasePriceInput(menuItemSample.basePrice);
      }
      if (menuItemSample.imageUrl !== undefined && menuItemSample.imageUrl !== null) {
        menuItemUpdatePage.setImageUrlInput(menuItemSample.imageUrl);
      }
      if (menuItemSample.active !== undefined && menuItemSample.active !== null) {
        menuItemUpdatePage.setActiveInput(menuItemSample.active);
      }
      if (menuItemSample.featured !== undefined && menuItemSample.featured !== null) {
        menuItemUpdatePage.setFeaturedInput(menuItemSample.featured);
      }
      if (menuItemSample.availableForBreakfast !== undefined && menuItemSample.availableForBreakfast !== null) {
        menuItemUpdatePage.setAvailableForBreakfastInput(menuItemSample.availableForBreakfast);
      }
      if (menuItemSample.availableForLunch !== undefined && menuItemSample.availableForLunch !== null) {
        menuItemUpdatePage.setAvailableForLunchInput(menuItemSample.availableForLunch);
      }
      if (menuItemSample.availableForDinner !== undefined && menuItemSample.availableForDinner !== null) {
        menuItemUpdatePage.setAvailableForDinnerInput(menuItemSample.availableForDinner);
      }
      if (menuItemSample.displayOrder !== undefined && menuItemSample.displayOrder !== null) {
        menuItemUpdatePage.setDisplayOrderInput(menuItemSample.displayOrder);
      }
      if (menuItemSample.createdDate !== undefined && menuItemSample.createdDate !== null) {
        menuItemUpdatePage.setCreatedDateInput(menuItemSample.createdDate);
      }
      if (menuItemSample.lastModifiedDate !== undefined && menuItemSample.lastModifiedDate !== null) {
        menuItemUpdatePage.setLastModifiedDateInput(menuItemSample.lastModifiedDate);
      }
      menuItemUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        menuItem = body;
      });

      menuItemComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
