import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MenuItem } from './menu-item.model';
import { MenuItemService } from './menu-item.service';

@Component({
  selector: 'page-menu-item',
  templateUrl: 'menu-item.html',
})
export class MenuItemPage {
  menuItems: MenuItem[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private menuItemService: MenuItemService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.menuItems = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.menuItemService
      .query()
      .pipe(
        filter((res: HttpResponse<MenuItem[]>) => res.ok),
        map((res: HttpResponse<MenuItem[]>) => res.body),
      )
      .subscribe(
        (response: MenuItem[]) => {
          this.menuItems = response;
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

  trackId(index: number, item: MenuItem) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/menu-item/new');
  }

  async edit(item: IonItemSliding, menuItem: MenuItem) {
    await this.navController.navigateForward('/tabs/entities/menu-item/' + menuItem.id + '/edit');
    await item.close();
  }

  async delete(menuItem) {
    this.menuItemService.delete(menuItem.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'MenuItem deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(menuItem: MenuItem) {
    await this.navController.navigateForward('/tabs/entities/menu-item/' + menuItem.id + '/view');
  }
}
