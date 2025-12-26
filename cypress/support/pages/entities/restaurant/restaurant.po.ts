import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class RestaurantComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-restaurant';
}

export class RestaurantUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-restaurant-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setSlugInput(slug: string) {
    this.setInputValue('slug', slug);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setAddressInput(address: string) {
    this.setInputValue('address', address);
  }

  setPhoneInput(phone: string) {
    this.setInputValue('phone', phone);
  }

  setEmailInput(email: string) {
    this.setInputValue('email', email);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }

  setLogoUrlInput(logoUrl: string) {
    this.setInputValue('logoUrl', logoUrl);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }

  setLastModifiedDateInput(lastModifiedDate: string) {
    this.setDateTime('lastModifiedDate', lastModifiedDate);
  }
}

export class RestaurantDetailPage extends EntityDetailPage {
  pageSelector = 'page-restaurant-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getSlugContent() {
    return cy.get('#slug-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getAddressContent() {
    return cy.get('#address-content');
  }

  getPhoneContent() {
    return cy.get('#phone-content');
  }

  getEmailContent() {
    return cy.get('#email-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }

  getLogoUrlContent() {
    return cy.get('#logoUrl-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }

  getLastModifiedDateContent() {
    return cy.get('#lastModifiedDate-content');
  }
}
