import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatMessage } from './chat-message.model';
import { ChatMessageService } from './chat-message.service';
import { Service, ServiceService } from '../service';
import { User } from '#app/services/user/user.model';
import { UserService } from '#app/services/user/user.service';

@Component({
  selector: 'page-chat-message-update',
  templateUrl: 'chat-message-update.html',
})
export class ChatMessageUpdatePage implements OnInit {
  chatMessage: ChatMessage;
  services: Service[];
  users: User[];
  sentAt: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    messageText: [null, [Validators.required]],
    sentAt: [null, [Validators.required]],
    readByRecipient: ['false', []],
    service: [null, [Validators.required]],
    sender: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private serviceService: ServiceService,
    private userService: UserService,
    private chatMessageService: ChatMessageService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.serviceService.query().subscribe(
      data => {
        this.services = data.body;
      },
      error => this.onError(error),
    );
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.chatMessage = response.data;
      this.isNew = this.chatMessage.id === null || this.chatMessage.id === undefined;
      this.updateForm(this.chatMessage);
    });
  }

  updateForm(chatMessage: ChatMessage) {
    this.form.patchValue({
      id: chatMessage.id,
      messageText: chatMessage.messageText,
      sentAt: this.isNew ? new Date().toISOString() : chatMessage.sentAt,
      readByRecipient: chatMessage.readByRecipient,
      service: chatMessage.service,
      sender: chatMessage.sender,
    });
  }

  save() {
    this.isSaving = true;
    const chatMessage = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.chatMessageService.update(chatMessage));
    } else {
      this.subscribeToSaveResponse(this.chatMessageService.create(chatMessage));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ChatMessage ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/chat-message');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareService(first: Service, second: Service): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackServiceById(index: number, item: Service) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ChatMessage>>) {
    result.subscribe(
      (res: HttpResponse<ChatMessage>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): ChatMessage {
    return {
      ...new ChatMessage(),
      id: this.form.get(['id']).value,
      messageText: this.form.get(['messageText']).value,
      sentAt: this.form.get(['sentAt']).value,
      readByRecipient: this.form.get(['readByRecipient']).value,
      service: this.form.get(['service']).value,
      sender: this.form.get(['sender']).value,
    };
  }
}
