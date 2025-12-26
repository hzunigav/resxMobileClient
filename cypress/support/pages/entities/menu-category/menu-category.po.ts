import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MenuCategoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-menu-category';
}

export class MenuCategoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-menu-category-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setDisplayOrderInput(displayOrder: string) {
    this.setInputValue('displayOrder', displayOrder);
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

export class MenuCategoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-menu-category-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getDisplayOrderContent() {
    return cy.get('#displayOrder-content');
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
