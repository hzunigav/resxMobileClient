import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { RestaurantPage } from './restaurant';
import { RestaurantUpdatePage } from './restaurant-update';
import { Restaurant, RestaurantService, RestaurantDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class RestaurantResolve implements Resolve<Restaurant> {
  constructor(private service: RestaurantService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Restaurant> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Restaurant>) => response.ok),
        map((restaurant: HttpResponse<Restaurant>) => restaurant.body),
      );
    }
    return of(new Restaurant());
  }
}

const routes: Routes = [
  {
    path: '',
    component: RestaurantPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RestaurantUpdatePage,
    resolve: {
      data: RestaurantResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RestaurantDetailPage,
    resolve: {
      data: RestaurantResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RestaurantUpdatePage,
    resolve: {
      data: RestaurantResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [RestaurantPage, RestaurantUpdatePage, RestaurantDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class RestaurantPageModule {}
