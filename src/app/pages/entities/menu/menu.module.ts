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

import { MenuPage } from './menu';
import { MenuUpdatePage } from './menu-update';
import { Menu, MenuService, MenuDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class MenuResolve implements Resolve<Menu> {
  constructor(private service: MenuService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Menu> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Menu>) => response.ok),
        map((menu: HttpResponse<Menu>) => menu.body),
      );
    }
    return of(new Menu());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MenuUpdatePage,
    resolve: {
      data: MenuResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenuDetailPage,
    resolve: {
      data: MenuResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenuUpdatePage,
    resolve: {
      data: MenuResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MenuPage, MenuUpdatePage, MenuDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MenuPageModule {}
