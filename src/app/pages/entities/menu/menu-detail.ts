import { Component, OnInit } from '@angular/core';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-menu-detail',
  templateUrl: 'menu-detail.html',
})
export class MenuDetailPage implements OnInit {
  menu: Menu = {};

  constructor(
    private navController: NavController,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.menu = response.data;
    });
  }

  open(item: Menu) {
    this.navController.navigateForward('/tabs/entities/menu/' + item.id + '/edit');
  }

  async deleteModal(item: Menu) {
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
            this.menuService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/menu');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
