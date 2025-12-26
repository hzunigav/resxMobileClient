import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ChatMessage } from './chat-message.model';
import { ChatMessageService } from './chat-message.service';

@Component({
  selector: 'page-chat-message',
  templateUrl: 'chat-message.html',
})
export class ChatMessagePage {
  chatMessages: ChatMessage[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private chatMessageService: ChatMessageService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.chatMessages = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.chatMessageService
      .query()
      .pipe(
        filter((res: HttpResponse<ChatMessage[]>) => res.ok),
        map((res: HttpResponse<ChatMessage[]>) => res.body),
      )
      .subscribe(
        (response: ChatMessage[]) => {
          this.chatMessages = response;
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

  trackId(index: number, item: ChatMessage) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/chat-message/new');
  }

  async edit(item: IonItemSliding, chatMessage: ChatMessage) {
    await this.navController.navigateForward('/tabs/entities/chat-message/' + chatMessage.id + '/edit');
    await item.close();
  }

  async delete(chatMessage) {
    this.chatMessageService.delete(chatMessage.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ChatMessage deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(chatMessage: ChatMessage) {
    await this.navController.navigateForward('/tabs/entities/chat-message/' + chatMessage.id + '/view');
  }
}
