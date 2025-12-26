import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { LoginService } from '#app/services/login/login.service';
import { QrScannerService } from '#app/services/qr-scanner/qr-scanner.service';
import { ServiceStatusService, ActiveServiceInfo } from '#app/services/service-status/service-status.service';
import { ServiceService } from '#app/pages/entities/service/service.service';
import { Service, ServiceStatus } from '#app/pages/entities/service/service.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account | null = null;
  activeService: ActiveServiceInfo | null = null;
  isOnline = true;
  isScanning = false;

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private qrScannerService: QrScannerService,
    private serviceStatusService: ServiceStatusService,
    private serviceService: ServiceService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  async ngOnInit() {
    // Load account info
    this.accountService.identity().then(account => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });

    // Subscribe to active service changes
    this.serviceStatusService.activeService$.subscribe(service => {
      this.activeService = service;
    });

    // Check network status
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    // Listen for network status changes
    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  /**
   * Scan QR code and create/resume service
   */
  async scanQRCode() {
    if (!this.isOnline) {
      this.showOfflineMessage();
      return;
    }

    if (this.isScanning) {
      return;
    }

    this.isScanning = true;

    try {
      // Scan QR code
      const result = await this.qrScannerService.scanQRCode();

      // Parse QR code data
      const qrInfo = this.qrScannerService.parseResXQRCode(result.data);

      if (!qrInfo) {
        await this.showInvalidQRMessage();
        this.isScanning = false;
        return;
      }

      // Create or get service
      await this.createService(qrInfo.tableId, qrInfo.restaurantId);
    } catch (error: any) {
      console.error('QR scan error:', error);

      if (error.message !== 'User cancelled photos app') {
        await this.showErrorMessage(error.message || 'Failed to scan QR code');
      }
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Show manual code entry dialog
   */
  async enterCodeManually() {
    if (!this.isOnline) {
      this.showOfflineMessage();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Enter Table Code',
      message: 'Format: resx://table/{tableId}/restaurant/{restaurantId}',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'resx://table/123/restaurant/456',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: async data => {
            const qrInfo = this.qrScannerService.parseResXQRCode(data.code);

            if (!qrInfo) {
              await this.showInvalidQRMessage();
              return false;
            }

            await this.createService(qrInfo.tableId, qrInfo.restaurantId);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Create a new service for the scanned table
   */
  private async createService(tableId: number, restaurantId: number) {
    try {
      const toast = await this.toastController.create({
        message: 'Creating service...',
        duration: 2000,
        position: 'top',
      });
      toast.present();

      // Prepare QR scan data
      const qrData = {
        restaurantId,
        tableId,
      };

      // Call backend to create service via scan endpoint
      this.serviceService.scanQRCode(qrData).subscribe(
        async response => {
          const createdService = response.body;
          if (!createdService) {
            await this.showErrorMessage('Invalid service response from server.');
            return;
          }

          // Save to service status
          if (
            createdService.id &&
            createdService.table?.id &&
            createdService.restaurant?.id &&
            createdService.initiatedAt
          ) {
            const serviceInfo: ActiveServiceInfo = {
              serviceId: createdService.id,
              tableId: createdService.table.id,
              restaurantId: createdService.restaurant.id,
              initiatedAt: createdService.initiatedAt,
            };

            await this.serviceStatusService.setActiveService(serviceInfo);

            // Navigate to service chat
            this.navController.navigateForward(`/service/${createdService.id}`);
          } else {
            await this.showErrorMessage('Invalid service response from server.');
          }
        },
        async error => {
          console.error('Error creating service:', error);
          await this.showErrorMessage('Failed to create service. Please try again.');
        },
      );
    } catch (error) {
      console.error('Error creating service:', error);
      await this.showErrorMessage('Failed to create service. Please try again.');
    }
  }

  /**
   * Resume active service
   */
  async resumeService() {
    if (!this.activeService) {
      return;
    }

    this.navController.navigateForward(`/service/${this.activeService.serviceId}`);
  }

  /**
   * End/clear active service
   */
  async endService() {
    const alert = await this.alertController.create({
      header: 'End Service',
      message: 'Are you sure you want to end this service?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'End Service',
          role: 'destructive',
          handler: async () => {
            await this.serviceStatusService.clearActiveService();
            const toast = await this.toastController.create({
              message: 'Service ended',
              duration: 2000,
              position: 'top',
              color: 'success',
            });
            toast.present();
          },
        },
      ],
    });

    await alert.present();
  }

  private async showInvalidQRMessage() {
    const toast = await this.toastController.create({
      message: 'Invalid QR code. Please scan a ResXperience table QR code.',
      duration: 3000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }

  private async showOfflineMessage() {
    const toast = await this.toastController.create({
      message: 'No internet connection. Please check your network.',
      duration: 3000,
      position: 'top',
      color: 'warning',
    });
    toast.present();
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }
}
