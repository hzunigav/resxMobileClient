import { Component, OnInit } from '@angular/core';
import { ChatMessage } from './chat-message.model';
import { ChatMessageService } from './chat-message.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-chat-message-detail',
  templateUrl: 'chat-message-detail.html',
})
export class ChatMessageDetailPage implements OnInit {
  chatMessage: ChatMessage = {};

  constructor(
    private navController: NavController,
    private chatMessageService: ChatMessageService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.chatMessage = response.data;
    });
  }

  open(item: ChatMessage) {
    this.navController.navigateForward('/tabs/entities/chat-message/' + item.id + '/edit');
  }

  async deleteModal(item: ChatMessage) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.chatMessageService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/chat-message');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
