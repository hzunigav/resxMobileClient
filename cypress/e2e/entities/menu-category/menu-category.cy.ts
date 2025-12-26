import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  MenuCategoryComponentsPage,
  MenuCategoryDetailPage,
  MenuCategoryUpdatePage,
} from '../../../support/pages/entities/menu-category/menu-category.po';
import menuCategorySample from './menu-category.json';

describe('MenuCategory entity', () => {
  const COMPONENT_TITLE = 'Menu Categories';
  const SUBCOMPONENT_TITLE = 'Menu Category';

  const menuCategoryPageUrl = '/tabs/entities/menu-category';
  const menuCategoryApiUrl = '/api/menu-categories';

  const menuCategoryComponentsPage = new MenuCategoryComponentsPage();
  const menuCategoryUpdatePage = new MenuCategoryUpdatePage();
  const menuCategoryDetailPage = new MenuCategoryDetailPage();

  let menuCategory: any;

  beforeEach(() => {
    menuCategory = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load MenuCategories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      menuCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', menuCategoryPageUrl);

      menuCategoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create MenuCategory page and go back', () => {
      cy.visit(menuCategoryPageUrl);
      menuCategoryComponentsPage.clickOnCreateButton();

      menuCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      menuCategoryUpdatePage.back();
      cy.url().should('include', menuCategoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: menuCategoryApiUrl,
        body: menuCategorySample,
      }).then(({ body }) => {
        menuCategory = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${menuCategoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [menuCategory],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (menuCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuCategoryApiUrl}/${menuCategory.id}`,
        }).then(() => {
          menuCategory = undefined;
        });
      }
    });

    it('should open MenuCategory view, open MenuCategory edit and go back', () => {
      cy.visit(menuCategoryPageUrl);
      menuCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (menuCategory.name !== undefined && menuCategory.name !== null) {
        menuCategoryDetailPage.getNameContent().contains(menuCategory.name);
      }
      if (menuCategory.description !== undefined && menuCategory.description !== null) {
        menuCategoryDetailPage.getDescriptionContent().contains(menuCategory.description);
      }
      if (menuCategory.displayOrder !== undefined && menuCategory.displayOrder !== null) {
        menuCategoryDetailPage.getDisplayOrderContent().contains(menuCategory.displayOrder);
      }
      menuCategoryDetailPage.edit();

      menuCategoryUpdatePage.back();
      menuCategoryDetailPage.back();
      cy.url().should('include', menuCategoryPageUrl);
    });

    it('should open MenuCategory view, open MenuCategory edit and save', () => {
      cy.visit(menuCategoryPageUrl);
      menuCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      menuCategoryDetailPage.edit();

      menuCategoryUpdatePage.save();
      cy.url().should('include', menuCategoryPageUrl);
    });

    it('should delete MenuCategory', () => {
      cy.visit(menuCategoryPageUrl);
      menuCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      menuCategoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      menuCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      menuCategory = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: menuCategoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (menuCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${menuCategoryApiUrl}/${menuCategory.id}`,
        }).then(() => {
          menuCategory = undefined;
        });
      }
    });

    it('should create MenuCategory', () => {
      cy.visit(menuCategoryPageUrl + '/new');

      menuCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (menuCategorySample.name !== undefined && menuCategorySample.name !== null) {
        menuCategoryUpdatePage.setNameInput(menuCategorySample.name);
      }
      if (menuCategorySample.description !== undefined && menuCategorySample.description !== null) {
        menuCategoryUpdatePage.setDescriptionInput(menuCategorySample.description);
      }
      if (menuCategorySample.displayOrder !== undefined && menuCategorySample.displayOrder !== null) {
        menuCategoryUpdatePage.setDisplayOrderInput(menuCategorySample.displayOrder);
      }
      if (menuCategorySample.active !== undefined && menuCategorySample.active !== null) {
        menuCategoryUpdatePage.setActiveInput(menuCategorySample.active);
      }
      if (menuCategorySample.createdDate !== undefined && menuCategorySample.createdDate !== null) {
        menuCategoryUpdatePage.setCreatedDateInput(menuCategorySample.createdDate);
      }
      if (menuCategorySample.lastModifiedDate !== undefined && menuCategorySample.lastModifiedDate !== null) {
        menuCategoryUpdatePage.setLastModifiedDateInput(menuCategorySample.lastModifiedDate);
      }
      menuCategoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        menuCategory = body;
      });

      menuCategoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
