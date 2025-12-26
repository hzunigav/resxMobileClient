import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MenuComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-menu';
}

export class MenuUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-menu-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }

  setLastModifiedDateInput(lastModifiedDate: string) {
    this.setDateTime('lastModifiedDate', lastModifiedDate);
  }
}

export class MenuDetailPage extends EntityDetailPage {
  pageSelector = 'page-menu-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }

  getLastModifiedDateContent() {
    return cy.get('#lastModifiedDate-content');
  }
}
