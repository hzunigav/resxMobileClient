import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private platform: Platform) {}

  async initPushNotifications(): Promise<void> {
    if (!this.platform.is('capacitor')) {
      console.log('Push notifications only available on native platforms');
      return;
    }

    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission denied');
        return;
      }

      // Register for push notifications
      await PushNotifications.register();

      // On success, register listeners
      this.addListeners();
    } catch (error) {
      console.error('Push notification initialization error:', error);
    }
  }

  private addListeners(): void {
    // Registration success
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send token to backend API
      // this.sendTokenToBackend(token.value);
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error);
    });

    // Push notification received while app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ', notification);
      // TODO: Display in-app notification
    });

    // User tapped on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ', notification);
      // TODO: Navigate to relevant screen based on notification data
    });
  }

  async getDeliveredNotifications(): Promise<any[]> {
    if (!this.platform.is('capacitor')) {
      return [];
    }

    const notificationList = await PushNotifications.getDeliveredNotifications();
    return notificationList.notifications;
  }

  async removeAllDeliveredNotifications(): Promise<void> {
    if (!this.platform.is('capacitor')) {
      return;
    }

    await PushNotifications.removeAllDeliveredNotifications();
  }
}
