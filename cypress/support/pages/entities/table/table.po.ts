import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class TableComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-table';
}

export class TableUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-table-update';

  setTableNumberInput(tableNumber: string) {
    this.setInputValue('tableNumber', tableNumber);
  }

  setCapacityInput(capacity: string) {
    this.setInputValue('capacity', capacity);
  }

  setQrCodeUrlInput(qrCodeUrl: string) {
    this.setInputValue('qrCodeUrl', qrCodeUrl);
  }

  setQrTokenInput(qrToken: string) {
    this.setInputValue('qrToken', qrToken);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }
}

export class TableDetailPage extends EntityDetailPage {
  pageSelector = 'page-table-detail';

  getTableNumberContent() {
    return cy.get('#tableNumber-content');
  }

  getCapacityContent() {
    return cy.get('#capacity-content');
  }

  getQrCodeUrlContent() {
    return cy.get('#qrCodeUrl-content');
  }

  getQrTokenContent() {
    return cy.get('#qrToken-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }
}
