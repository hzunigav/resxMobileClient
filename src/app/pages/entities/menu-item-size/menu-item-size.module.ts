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

import { MenuItemSizePage } from './menu-item-size';
import { MenuItemSizeUpdatePage } from './menu-item-size-update';
import { MenuItemSize, MenuItemSizeService, MenuItemSizeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class MenuItemSizeResolve implements Resolve<MenuItemSize> {
  constructor(private service: MenuItemSizeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MenuItemSize> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MenuItemSize>) => response.ok),
        map((menuItemSize: HttpResponse<MenuItemSize>) => menuItemSize.body),
      );
    }
    return of(new MenuItemSize());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MenuItemSizePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MenuItemSizeUpdatePage,
    resolve: {
      data: MenuItemSizeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenuItemSizeDetailPage,
    resolve: {
      data: MenuItemSizeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenuItemSizeUpdatePage,
    resolve: {
      data: MenuItemSizeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MenuItemSizePage, MenuItemSizeUpdatePage, MenuItemSizeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MenuItemSizePageModule {}
