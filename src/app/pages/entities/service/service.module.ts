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

import { ServicePage } from './service';
import { ServiceUpdatePage } from './service-update';
import { Service, ServiceService, ServiceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceResolve implements Resolve<Service> {
  constructor(private service: ServiceService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Service> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Service>) => response.ok),
        map((service: HttpResponse<Service>) => service.body),
      );
    }
    return of(new Service());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServicePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceUpdatePage,
    resolve: {
      data: ServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceDetailPage,
    resolve: {
      data: ServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceUpdatePage,
    resolve: {
      data: ServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServicePage, ServiceUpdatePage, ServiceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServicePageModule {}
