import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ServiceDetailPage implements OnInit {
  serviceId: number | null = null;
  service: any = null;
  orders: any[] = [];
  loading = true;
  error: string | null = null;
  closingService = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private orderService: OrderService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = parseInt(id, 10);
      this.loadServiceDetails();
    } else {
      this.error = 'No service ID provided';
      this.loading = false;
    }
  }

  loadServiceDetails() {
    if (!this.serviceId) return;

    this.loading = true;
    this.error = null;

    // Load service and orders
    // Note: In a real implementation, you'd have a service method to get service details
    // For now, we'll just load the orders
    this.orderService.getOrdersForService(this.serviceId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading service details:', err);
        this.error = err.error?.message || 'Failed to load service details';
        this.loading = false;
      }
    });
  }

  get totalBillPreview(): number {
    return this.orders
      .filter(order => order.status !== 'REJECTED')
      .reduce((sum, order) => sum + (order.total || 0), 0);
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(order => order.status === 'DELIVERED').length;
  }

  get canCloseService(): boolean {
    return this.deliveredOrdersCount > 0 && !this.closingService;
  }

  async presentCloseConfirmation() {
    const alert = await this.alertController.create({
      header: 'Close Service',
      message: `
        <div class="close-confirmation">
          <p><strong>Are you sure you want to close this service?</strong></p>
          <div class="bill-preview">
            <p>Total Orders: ${this.orders.length}</p>
            <p>Delivered: ${this.deliveredOrdersCount}</p>
            <p class="total">Total Bill: $${this.totalBillPreview.toFixed(2)}</p>
          </div>
          <p class="warning">This action cannot be undone.</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Close Service',
          cssClass: 'danger',
          handler: () => {
            this.closeService();
          }
        }
      ]
    });

    await alert.present();
  }

  closeService() {
    if (!this.serviceId || !this.canCloseService) return;

    this.closingService = true;

    this.serviceService.closeService(this.serviceId).subscribe({
      next: (check) => {
        this.closingService = false;
        // Navigate to check page
        this.router.navigate(['/check', this.serviceId], {
          state: { check }
        });
      },
      error: (err) => {
        this.closingService = false;
        console.error('Error closing service:', err);
        this.presentErrorAlert(err.error?.message || 'Failed to close service');
      }
    });
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  handleRefresh(event: any) {
    this.loadServiceDetails();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'primary';
      case 'PREPARING': return 'secondary';
      case 'DELIVERED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'medium';
    }
  }
}
