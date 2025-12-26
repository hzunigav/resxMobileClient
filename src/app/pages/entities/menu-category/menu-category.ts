import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MenuCategory } from './menu-category.model';
import { MenuCategoryService } from './menu-category.service';

@Component({
  selector: 'page-menu-category',
  templateUrl: 'menu-category.html',
})
export class MenuCategoryPage {
  menuCategories: MenuCategory[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private menuCategoryService: MenuCategoryService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.menuCategories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.menuCategoryService
      .query()
      .pipe(
        filter((res: HttpResponse<MenuCategory[]>) => res.ok),
        map((res: HttpResponse<MenuCategory[]>) => res.body),
      )
      .subscribe(
        (response: MenuCategory[]) => {
          this.menuCategories = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        },
      );
  }

  trackId(index: number, item: MenuCategory) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/menu-category/new');
  }

  async edit(item: IonItemSliding, menuCategory: MenuCategory) {
    await this.navController.navigateForward('/tabs/entities/menu-category/' + menuCategory.id + '/edit');
    await item.close();
  }

  async delete(menuCategory) {
    this.menuCategoryService.delete(menuCategory.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'MenuCategory deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(menuCategory: MenuCategory) {
    await this.navController.navigateForward('/tabs/entities/menu-category/' + menuCategory.id + '/view');
  }
}
