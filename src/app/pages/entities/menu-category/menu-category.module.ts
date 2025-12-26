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

import { MenuCategoryPage } from './menu-category';
import { MenuCategoryUpdatePage } from './menu-category-update';
import { MenuCategory, MenuCategoryService, MenuCategoryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class MenuCategoryResolve implements Resolve<MenuCategory> {
  constructor(private service: MenuCategoryService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MenuCategory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MenuCategory>) => response.ok),
        map((menuCategory: HttpResponse<MenuCategory>) => menuCategory.body),
      );
    }
    return of(new MenuCategory());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MenuCategoryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MenuCategoryUpdatePage,
    resolve: {
      data: MenuCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenuCategoryDetailPage,
    resolve: {
      data: MenuCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenuCategoryUpdatePage,
    resolve: {
      data: MenuCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MenuCategoryPage, MenuCategoryUpdatePage, MenuCategoryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MenuCategoryPageModule {}
