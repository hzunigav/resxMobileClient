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

import { ChatMessagePage } from './chat-message';
import { ChatMessageUpdatePage } from './chat-message-update';
import { ChatMessage, ChatMessageService, ChatMessageDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ChatMessageResolve implements Resolve<ChatMessage> {
  constructor(private service: ChatMessageService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ChatMessage> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ChatMessage>) => response.ok),
        map((chatMessage: HttpResponse<ChatMessage>) => chatMessage.body),
      );
    }
    return of(new ChatMessage());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ChatMessagePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChatMessageUpdatePage,
    resolve: {
      data: ChatMessageResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChatMessageDetailPage,
    resolve: {
      data: ChatMessageResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChatMessageUpdatePage,
    resolve: {
      data: ChatMessageResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ChatMessagePage, ChatMessageUpdatePage, ChatMessageDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ChatMessagePageModule {}
