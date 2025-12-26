import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private isOnline$ = new BehaviorSubject<boolean>(true);

  constructor(private platform: Platform) {
    this.initNetworkStatus();
  }

  async initNetworkStatus(): Promise<void> {
    if (!this.platform.is('capacitor')) {
      // For web, use navigator.onLine
      this.isOnline$.next(navigator.onLine);
      window.addEventListener('online', () => this.isOnline$.next(true));
      window.addEventListener('offline', () => this.isOnline$.next(false));
      return;
    }

    try {
      // Get initial status
      const status = await Network.getStatus();
      this.isOnline$.next(status.connected);

      // Listen for network changes
      Network.addListener('networkStatusChange', (status) => {
        console.log('Network status changed:', status);
        this.isOnline$.next(status.connected);
      });
    } catch (error) {
      console.error('Network status initialization error:', error);
    }
  }

  getNetworkStatus(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  isOnline(): boolean {
    return this.isOnline$.value;
  }

  async getCurrentStatus(): Promise<any> {
    if (!this.platform.is('capacitor')) {
      return {
        connected: navigator.onLine,
        connectionType: 'unknown'
      };
    }

    return await Network.getStatus();
  }
}
