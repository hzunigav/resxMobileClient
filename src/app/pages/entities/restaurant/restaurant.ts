import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Component({
  selector: 'page-restaurant',
  templateUrl: 'restaurant.html',
})
export class RestaurantPage {
  restaurants: Restaurant[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private restaurantService: RestaurantService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.restaurants = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.restaurantService
      .query()
      .pipe(
        filter((res: HttpResponse<Restaurant[]>) => res.ok),
        map((res: HttpResponse<Restaurant[]>) => res.body),
      )
      .subscribe(
        (response: Restaurant[]) => {
          this.restaurants = response;
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

  trackId(index: number, item: Restaurant) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/restaurant/new');
  }

  async edit(item: IonItemSliding, restaurant: Restaurant) {
    await this.navController.navigateForward('/tabs/entities/restaurant/' + restaurant.id + '/edit');
    await item.close();
  }

  async delete(restaurant) {
    this.restaurantService.delete(restaurant.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Restaurant deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(restaurant: Restaurant) {
    await this.navController.navigateForward('/tabs/entities/restaurant/' + restaurant.id + '/view');
  }
}
