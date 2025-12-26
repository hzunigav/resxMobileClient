import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ActiveServiceInfo {
  serviceId: number;
  tableId: number;
  restaurantId: number;
  tableName?: string;
  restaurantName?: string;
  initiatedAt: string;
}

const ACTIVE_SERVICE_KEY = 'active_service';

@Injectable({
  providedIn: 'root',
})
export class ServiceStatusService {
  private activeServiceSubject = new BehaviorSubject<ActiveServiceInfo | null>(null);
  public activeService$: Observable<ActiveServiceInfo | null> = this.activeServiceSubject.asObservable();

  constructor() {
    this.loadActiveService();
  }

  /**
   * Load active service from Capacitor Preferences on app init
   */
  private async loadActiveService(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: ACTIVE_SERVICE_KEY });
      if (value) {
        const serviceInfo: ActiveServiceInfo = JSON.parse(value);
        this.activeServiceSubject.next(serviceInfo);
      }
    } catch (error) {
      console.error('Error loading active service:', error);
    }
  }

  /**
   * Get the current active service info
   * @returns The current active service or null
   */
  getActiveService(): ActiveServiceInfo | null {
    return this.activeServiceSubject.value;
  }

  /**
   * Set the active service and persist to storage
   * @param serviceInfo The service information to store
   */
  async setActiveService(serviceInfo: ActiveServiceInfo): Promise<void> {
    try {
      await Preferences.set({
        key: ACTIVE_SERVICE_KEY,
        value: JSON.stringify(serviceInfo),
      });
      this.activeServiceSubject.next(serviceInfo);
    } catch (error) {
      console.error('Error saving active service:', error);
      throw error;
    }
  }

  /**
   * Clear the active service from memory and storage
   */
  async clearActiveService(): Promise<void> {
    try {
      await Preferences.remove({ key: ACTIVE_SERVICE_KEY });
      this.activeServiceSubject.next(null);
    } catch (error) {
      console.error('Error clearing active service:', error);
      throw error;
    }
  }

  /**
   * Check if there's an active service
   * @returns true if there's an active service
   */
  hasActiveService(): boolean {
    return this.activeServiceSubject.value !== null;
  }

  /**
   * Get the active service ID
   * @returns The service ID or null if no active service
   */
  getActiveServiceId(): number | null {
    const service = this.activeServiceSubject.value;
    return service ? service.serviceId : null;
  }

  /**
   * Update specific fields of the active service
   * @param updates Partial updates to apply to the active service
   */
  async updateActiveService(updates: Partial<ActiveServiceInfo>): Promise<void> {
    const currentService = this.activeServiceSubject.value;
    if (!currentService) {
      throw new Error('No active service to update');
    }

    const updatedService = { ...currentService, ...updates };
    await this.setActiveService(updatedService);
  }
}
