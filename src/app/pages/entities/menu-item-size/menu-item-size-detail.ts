import { Component, OnInit } from '@angular/core';
import { MenuItemSize } from './menu-item-size.model';
import { MenuItemSizeService } from './menu-item-size.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-menu-item-size-detail',
  templateUrl: 'menu-item-size-detail.html',
})
export class MenuItemSizeDetailPage implements OnInit {
  menuItemSize: MenuItemSize = {};

  constructor(
    private navController: NavController,
    private menuItemSizeService: MenuItemSizeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.menuItemSize = response.data;
    });
  }

  open(item: MenuItemSize) {
    this.navController.navigateForward('/tabs/entities/menu-item-size/' + item.id + '/edit');
  }

  async deleteModal(item: MenuItemSize) {
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
            this.menuItemSizeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/menu-item-size');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
