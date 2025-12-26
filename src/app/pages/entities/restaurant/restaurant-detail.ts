import { Component, OnInit } from '@angular/core';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-restaurant-detail',
  templateUrl: 'restaurant-detail.html',
})
export class RestaurantDetailPage implements OnInit {
  restaurant: Restaurant = {};

  constructor(
    private navController: NavController,
    private restaurantService: RestaurantService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.restaurant = response.data;
    });
  }

  open(item: Restaurant) {
    this.navController.navigateForward('/tabs/entities/restaurant/' + item.id + '/edit');
  }

  async deleteModal(item: Restaurant) {
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
            this.restaurantService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/restaurant');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
