import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  menus: Menu[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private menuService: MenuService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.menus = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.menuService
      .query()
      .pipe(
        filter((res: HttpResponse<Menu[]>) => res.ok),
        map((res: HttpResponse<Menu[]>) => res.body),
      )
      .subscribe(
        (response: Menu[]) => {
          this.menus = response;
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

  trackId(index: number, item: Menu) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/menu/new');
  }

  async edit(item: IonItemSliding, menu: Menu) {
    await this.navController.navigateForward('/tabs/entities/menu/' + menu.id + '/edit');
    await item.close();
  }

  async delete(menu) {
    this.menuService.delete(menu.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Menu deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(menu: Menu) {
    await this.navController.navigateForward('/tabs/entities/menu/' + menu.id + '/view');
  }
}
