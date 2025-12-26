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

import { TablePage } from './table';
import { TableUpdatePage } from './table-update';
import { Table, TableService, TableDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class TableResolve implements Resolve<Table> {
  constructor(private service: TableService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Table> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Table>) => response.ok),
        map((table: HttpResponse<Table>) => table.body),
      );
    }
    return of(new Table());
  }
}

const routes: Routes = [
  {
    path: '',
    component: TablePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TableUpdatePage,
    resolve: {
      data: TableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TableDetailPage,
    resolve: {
      data: TableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TableUpdatePage,
    resolve: {
      data: TableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [TablePage, TableUpdatePage, TableDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class TablePageModule {}
