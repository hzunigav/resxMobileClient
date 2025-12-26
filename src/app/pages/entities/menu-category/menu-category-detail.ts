import { Component, OnInit } from '@angular/core';
import { MenuCategory } from './menu-category.model';
import { MenuCategoryService } from './menu-category.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-menu-category-detail',
  templateUrl: 'menu-category-detail.html',
})
export class MenuCategoryDetailPage implements OnInit {
  menuCategory: MenuCategory = {};

  constructor(
    private navController: NavController,
    private menuCategoryService: MenuCategoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.menuCategory = response.data;
    });
  }

  open(item: MenuCategory) {
    this.navController.navigateForward('/tabs/entities/menu-category/' + item.id + '/edit');
  }

  async deleteModal(item: MenuCategory) {
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
            this.menuCategoryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/menu-category');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
