import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ServiceComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-service';
}

export class ServiceUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-service-update';

  setStatusInput(status: string) {
    this.select('status', status);
  }

  setInitiatedAtInput(initiatedAt: string) {
    this.setDateTime('initiatedAt', initiatedAt);
  }

  setAcknowledgedAtInput(acknowledgedAt: string) {
    this.setDateTime('acknowledgedAt', acknowledgedAt);
  }

  setCompletedAtInput(completedAt: string) {
    this.setDateTime('completedAt', completedAt);
  }
}

export class ServiceDetailPage extends EntityDetailPage {
  pageSelector = 'page-service-detail';

  getStatusContent() {
    return cy.get('#status-content');
  }

  getInitiatedAtContent() {
    return cy.get('#initiatedAt-content');
  }

  getAcknowledgedAtContent() {
    return cy.get('#acknowledgedAt-content');
  }

  getCompletedAtContent() {
    return cy.get('#completedAt-content');
  }
}
