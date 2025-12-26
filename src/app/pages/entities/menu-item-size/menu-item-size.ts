import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MenuItemSize } from './menu-item-size.model';
import { MenuItemSizeService } from './menu-item-size.service';

@Component({
  selector: 'page-menu-item-size',
  templateUrl: 'menu-item-size.html',
})
export class MenuItemSizePage {
  menuItemSizes: MenuItemSize[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private menuItemSizeService: MenuItemSizeService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.menuItemSizes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.menuItemSizeService
      .query()
      .pipe(
        filter((res: HttpResponse<MenuItemSize[]>) => res.ok),
        map((res: HttpResponse<MenuItemSize[]>) => res.body),
      )
      .subscribe(
        (response: MenuItemSize[]) => {
          this.menuItemSizes = response;
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

  trackId(index: number, item: MenuItemSize) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/menu-item-size/new');
  }

  async edit(item: IonItemSliding, menuItemSize: MenuItemSize) {
    await this.navController.navigateForward('/tabs/entities/menu-item-size/' + menuItemSize.id + '/edit');
    await item.close();
  }

  async delete(menuItemSize) {
    this.menuItemSizeService.delete(menuItemSize.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'MenuItemSize deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(menuItemSize: MenuItemSize) {
    await this.navController.navigateForward('/tabs/entities/menu-item-size/' + menuItemSize.id + '/view');
  }
}
