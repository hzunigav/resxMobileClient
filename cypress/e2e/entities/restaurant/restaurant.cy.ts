import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  RestaurantComponentsPage,
  RestaurantDetailPage,
  RestaurantUpdatePage,
} from '../../../support/pages/entities/restaurant/restaurant.po';
import restaurantSample from './restaurant.json';

describe('Restaurant entity', () => {
  const COMPONENT_TITLE = 'Restaurants';
  const SUBCOMPONENT_TITLE = 'Restaurant';

  const restaurantPageUrl = '/tabs/entities/restaurant';
  const restaurantApiUrl = '/api/restaurants';

  const restaurantComponentsPage = new RestaurantComponentsPage();
  const restaurantUpdatePage = new RestaurantUpdatePage();
  const restaurantDetailPage = new RestaurantDetailPage();

  let restaurant: any;

  beforeEach(() => {
    restaurant = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Restaurants page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      restaurantComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', restaurantPageUrl);

      restaurantComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Restaurant page and go back', () => {
      cy.visit(restaurantPageUrl);
      restaurantComponentsPage.clickOnCreateButton();

      restaurantUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      restaurantUpdatePage.back();
      cy.url().should('include', restaurantPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: restaurantApiUrl,
        body: restaurantSample,
      }).then(({ body }) => {
        restaurant = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${restaurantApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [restaurant],
          },
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (restaurant) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${restaurantApiUrl}/${restaurant.id}`,
        }).then(() => {
          restaurant = undefined;
        });
      }
    });

    it('should open Restaurant view, open Restaurant edit and go back', () => {
      cy.visit(restaurantPageUrl);
      restaurantComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      restaurantDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (restaurant.name !== undefined && restaurant.name !== null) {
        restaurantDetailPage.getNameContent().contains(restaurant.name);
      }
      if (restaurant.slug !== undefined && restaurant.slug !== null) {
        restaurantDetailPage.getSlugContent().contains(restaurant.slug);
      }
      if (restaurant.description !== undefined && restaurant.description !== null) {
        restaurantDetailPage.getDescriptionContent().contains(restaurant.description);
      }
      if (restaurant.address !== undefined && restaurant.address !== null) {
        restaurantDetailPage.getAddressContent().contains(restaurant.address);
      }
      if (restaurant.phone !== undefined && restaurant.phone !== null) {
        restaurantDetailPage.getPhoneContent().contains(restaurant.phone);
      }
      if (restaurant.email !== undefined && restaurant.email !== null) {
        restaurantDetailPage.getEmailContent().contains(restaurant.email);
      }
      if (restaurant.logoUrl !== undefined && restaurant.logoUrl !== null) {
        restaurantDetailPage.getLogoUrlContent().contains(restaurant.logoUrl);
      }
      restaurantDetailPage.edit();

      restaurantUpdatePage.back();
      restaurantDetailPage.back();
      cy.url().should('include', restaurantPageUrl);
    });

    it('should open Restaurant view, open Restaurant edit and save', () => {
      cy.visit(restaurantPageUrl);
      restaurantComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      restaurantDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      restaurantDetailPage.edit();

      restaurantUpdatePage.save();
      cy.url().should('include', restaurantPageUrl);
    });

    it('should delete Restaurant', () => {
      cy.visit(restaurantPageUrl);
      restaurantComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      restaurantDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      restaurantComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      restaurant = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: restaurantApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (restaurant) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${restaurantApiUrl}/${restaurant.id}`,
        }).then(() => {
          restaurant = undefined;
        });
      }
    });

    it('should create Restaurant', () => {
      cy.visit(restaurantPageUrl + '/new');

      restaurantUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (restaurantSample.name !== undefined && restaurantSample.name !== null) {
        restaurantUpdatePage.setNameInput(restaurantSample.name);
      }
      if (restaurantSample.slug !== undefined && restaurantSample.slug !== null) {
        restaurantUpdatePage.setSlugInput(restaurantSample.slug);
      }
      if (restaurantSample.description !== undefined && restaurantSample.description !== null) {
        restaurantUpdatePage.setDescriptionInput(restaurantSample.description);
      }
      if (restaurantSample.address !== undefined && restaurantSample.address !== null) {
        restaurantUpdatePage.setAddressInput(restaurantSample.address);
      }
      if (restaurantSample.phone !== undefined && restaurantSample.phone !== null) {
        restaurantUpdatePage.setPhoneInput(restaurantSample.phone);
      }
      if (restaurantSample.email !== undefined && restaurantSample.email !== null) {
        restaurantUpdatePage.setEmailInput(restaurantSample.email);
      }
      if (restaurantSample.active !== undefined && restaurantSample.active !== null) {
        restaurantUpdatePage.setActiveInput(restaurantSample.active);
      }
      if (restaurantSample.logoUrl !== undefined && restaurantSample.logoUrl !== null) {
        restaurantUpdatePage.setLogoUrlInput(restaurantSample.logoUrl);
      }
      if (restaurantSample.createdDate !== undefined && restaurantSample.createdDate !== null) {
        restaurantUpdatePage.setCreatedDateInput(restaurantSample.createdDate);
      }
      if (restaurantSample.lastModifiedDate !== undefined && restaurantSample.lastModifiedDate !== null) {
        restaurantUpdatePage.setLastModifiedDateInput(restaurantSample.lastModifiedDate);
      }
      restaurantUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        restaurant = body;
      });

      restaurantComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
