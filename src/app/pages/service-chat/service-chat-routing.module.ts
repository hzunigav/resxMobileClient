import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceChatPage } from './service-chat.page';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

const routes: Routes = [
  {
    path: '',
    component: ServiceChatPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceChatPageRoutingModule {}
