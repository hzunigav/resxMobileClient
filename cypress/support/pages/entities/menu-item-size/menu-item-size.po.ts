import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class MenuItemSizeComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-menu-item-size';
}

export class MenuItemSizeUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-menu-item-size-update';

  setSizeNameInput(sizeName: string) {
    this.setInputValue('sizeName', sizeName);
  }

  setPriceInput(price: string) {
    this.setInputValue('price', price);
  }

  setDisplayOrderInput(displayOrder: string) {
    this.setInputValue('displayOrder', displayOrder);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }
}

export class MenuItemSizeDetailPage extends EntityDetailPage {
  pageSelector = 'page-menu-item-size-detail';

  getSizeNameContent() {
    return cy.get('#sizeName-content');
  }

  getPriceContent() {
    return cy.get('#price-content');
  }

  getDisplayOrderContent() {
    return cy.get('#displayOrder-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }
}
