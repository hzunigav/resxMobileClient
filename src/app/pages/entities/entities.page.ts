import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: any[] = [
    { name: 'Table', component: 'TablePage', route: 'table' },
    { name: 'Service', component: 'ServicePage', route: 'service' },
    { name: 'Chat Message', component: 'ChatMessagePage', route: 'chat-message' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
