import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Service } from './service.model';
import { ServiceService } from './service.service';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  services: Service[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceService: ServiceService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.services = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceService
      .query()
      .pipe(
        filter((res: HttpResponse<Service[]>) => res.ok),
        map((res: HttpResponse<Service[]>) => res.body),
      )
      .subscribe(
        (response: Service[]) => {
          this.services = response;
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

  trackId(index: number, item: Service) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/service/new');
  }

  async edit(item: IonItemSliding, service: Service) {
    await this.navController.navigateForward('/tabs/entities/service/' + service.id + '/edit');
    await item.close();
  }

  async delete(service) {
    this.serviceService.delete(service.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Service deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(service: Service) {
    await this.navController.navigateForward('/tabs/entities/service/' + service.id + '/view');
  }
}
