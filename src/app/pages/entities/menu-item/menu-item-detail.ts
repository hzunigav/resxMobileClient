import { Component, OnInit } from '@angular/core';
import { MenuItem } from './menu-item.model';
import { MenuItemService } from './menu-item.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-menu-item-detail',
  templateUrl: 'menu-item-detail.html',
})
export class MenuItemDetailPage implements OnInit {
  menuItem: MenuItem = {};

  constructor(
    private navController: NavController,
    private menuItemService: MenuItemService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.menuItem = response.data;
    });
  }

  open(item: MenuItem) {
    this.navController.navigateForward('/tabs/entities/menu-item/' + item.id + '/edit');
  }

  async deleteModal(item: MenuItem) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.menuItemService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/menu-item');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
