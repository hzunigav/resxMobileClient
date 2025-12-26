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

import { MenuItemPage } from './menu-item';
import { MenuItemUpdatePage } from './menu-item-update';
import { MenuItem, MenuItemService, MenuItemDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class MenuItemResolve implements Resolve<MenuItem> {
  constructor(private service: MenuItemService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MenuItem> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MenuItem>) => response.ok),
        map((menuItem: HttpResponse<MenuItem>) => menuItem.body),
      );
    }
    return of(new MenuItem());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MenuItemPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MenuItemUpdatePage,
    resolve: {
      data: MenuItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenuItemDetailPage,
    resolve: {
      data: MenuItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenuItemUpdatePage,
    resolve: {
      data: MenuItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MenuItemPage, MenuItemUpdatePage, MenuItemDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MenuItemPageModule {}
