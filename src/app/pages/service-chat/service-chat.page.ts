import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, IonContent } from '@ionic/angular';
import { ChatPollingService } from '#app/services/chat/chat-polling.service';
import { ServiceStatusService } from '#app/services/service-status/service-status.service';
import { ServiceService } from '#app/pages/entities/service/service.service';
import { OrderService } from '#app/pages/entities/order/order.service';
import { ChatMessage } from '#app/pages/entities/chat-message/chat-message.model';
import { Service } from '#app/pages/entities/service/service.model';
import { Order } from '#app/pages/entities/order/order.model';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { MenuModalComponent } from './components/menu-modal/menu-modal.component';

@Component({
  selector: 'app-service-chat',
  templateUrl: './service-chat.page.html',
  styleUrls: ['./service-chat.page.scss'],
})
export class ServiceChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  serviceId: number | null = null;
  service: Service | null = null;
  messages: ChatMessage[] = [];
  orders: Order[] = [];
  newMessage = '';
  account: Account | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController,
    private chatPollingService: ChatPollingService,
    private serviceStatusService: ServiceStatusService,
    private serviceService: ServiceService,
    private orderService: OrderService,
    private accountService: AccountService,
  ) {}

  async ngOnInit() {
    // Get service ID from route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = parseInt(id, 10);
    }

    // Get account info
    this.account = await this.accountService.identity();

    if (this.serviceId) {
      // Load service details
      await this.loadService();

      // Subscribe to messages
      this.chatPollingService.messages$.subscribe(messages => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      });

      // Start polling for messages
      this.chatPollingService.startPolling(this.serviceId);

      // Load orders for this service
      this.loadOrders();
    }

    this.isLoading = false;
  }

  ngOnDestroy() {
    // Stop polling when leaving the page
    this.chatPollingService.stopPolling();
  }

  private async loadService() {
    if (!this.serviceId) {
      return;
    }

    this.serviceService.find(this.serviceId).subscribe(
      response => {
        this.service = response.body;
      },
      error => {
        console.error('Error loading service:', error);
      },
    );
  }

  private loadOrders() {
    if (!this.serviceId) {
      return;
    }

    this.orderService.query({ 'serviceId.equals': this.serviceId }).subscribe(
      response => {
        this.orders = response.body || [];
      },
      error => {
        console.error('Error loading orders:', error);
      },
    );
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.serviceId || !this.account) {
      return;
    }

    const message: ChatMessage = {
      serviceId: this.serviceId,
      senderType: 'CUSTOMER',
      senderId: this.account.id,
      content: this.newMessage.trim(),
      sentAt: new Date().toISOString(),
    };

    this.chatPollingService.sendMessage(message);
    this.newMessage = '';

    setTimeout(() => this.scrollToBottom(), 100);
  }

  async openMenu() {
    if (!this.service?.restaurantId) {
      return;
    }

    const modal = await this.modalController.create({
      component: MenuModalComponent,
      componentProps: {
        restaurantId: this.service.restaurantId,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.action === 'view-cart') {
      this.navController.navigateForward('/cart');
    }
  }

  isCustomerMessage(message: ChatMessage): boolean {
    return message.senderType === 'CUSTOMER';
  }

  getMessageTime(message: ChatMessage): string {
    if (!message.sentAt) {
      return '';
    }

    const date = new Date(message.sentAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getOrderStatus(order: Order): string {
    return order.status || 'PENDING';
  }

  goBack() {
    this.navController.navigateBack('/home');
  }

  private scrollToBottom() {
    if (this.content) {
      this.content.scrollToBottom(300);
    }
  }
}
