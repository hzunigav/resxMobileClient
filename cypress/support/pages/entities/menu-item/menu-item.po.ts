import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MenuItemComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-menu-item';
}

export class MenuItemUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-menu-item-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setBasePriceInput(basePrice: string) {
    this.setInputValue('basePrice', basePrice);
  }

  setImageUrlInput(imageUrl: string) {
    this.setInputValue('imageUrl', imageUrl);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }

  setFeaturedInput(featured: string) {
    this.setBoolean('featured', featured);
  }

  setAvailableForBreakfastInput(availableForBreakfast: string) {
    this.setBoolean('availableForBreakfast', availableForBreakfast);
  }

  setAvailableForLunchInput(availableForLunch: string) {
    this.setBoolean('availableForLunch', availableForLunch);
  }

  setAvailableForDinnerInput(availableForDinner: string) {
    this.setBoolean('availableForDinner', availableForDinner);
  }

  setDisplayOrderInput(displayOrder: string) {
    this.setInputValue('displayOrder', displayOrder);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }

  setLastModifiedDateInput(lastModifiedDate: string) {
    this.setDateTime('lastModifiedDate', lastModifiedDate);
  }
}

export class MenuItemDetailPage extends EntityDetailPage {
  pageSelector = 'page-menu-item-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getBasePriceContent() {
    return cy.get('#basePrice-content');
  }

  getImageUrlContent() {
    return cy.get('#imageUrl-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }

  getFeaturedContent() {
    return cy.get('#featured-content');
  }

  getAvailableForBreakfastContent() {
    return cy.get('#availableForBreakfast-content');
  }

  getAvailableForLunchContent() {
    return cy.get('#availableForLunch-content');
  }

  getAvailableForDinnerContent() {
    return cy.get('#availableForDinner-content');
  }

  getDisplayOrderContent() {
    return cy.get('#displayOrder-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }

  getLastModifiedDateContent() {
    return cy.get('#lastModifiedDate-content');
  }
}
