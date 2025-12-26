import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import jsQR from 'jsqr';

export interface QRScanResult {
  data: string;
  format?: string;
}

@Injectable({
  providedIn: 'root',
})
export class QrScannerService {
  /**
   * Scans a QR code using the device camera and jsQR library
   * @returns Promise with the scanned QR code data
   */
  async scanQRCode(): Promise<QRScanResult> {
    try {
      // Request camera permission and take photo
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: false,
        saveToGallery: false,
      });

      if (!photo.dataUrl) {
        throw new Error('No image data received from camera');
      }

      // Convert image to QR code data using jsQR
      const qrData = await this.decodeQRFromDataUrl(photo.dataUrl);

      if (!qrData) {
        throw new Error('No QR code found in image');
      }

      return {
        data: qrData,
        format: 'QR_CODE',
      };
    } catch (error) {
      console.error('QR scanning error:', error);
      throw error;
    }
  }

  /**
   * Decodes QR code from a data URL using jsQR
   * @param dataUrl Base64 data URL of the image
   * @returns The decoded QR code data or null if no QR code found
   */
  private async decodeQRFromDataUrl(dataUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          // Get image data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Decode QR code
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            resolve(code.data);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = dataUrl;
    });
  }

  /**
   * Parses a ResXperience QR code format: resx://table/{tableId}/restaurant/{restaurantId}
   * @param qrData The scanned QR code data
   * @returns Object with tableId and restaurantId, or null if invalid format
   */
  parseResXQRCode(qrData: string): { tableId: number; restaurantId: number } | null {
    try {
      // Expected format: resx://table/{tableId}/restaurant/{restaurantId}
      const pattern = /^resx:\/\/table\/(\d+)\/restaurant\/(\d+)$/;
      const match = qrData.match(pattern);

      if (match) {
        return {
          tableId: parseInt(match[1], 10),
          restaurantId: parseInt(match[2], 10),
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing QR code:', error);
      return null;
    }
  }

  /**
   * Validates if the scanned QR code is in ResXperience format
   * @param qrData The scanned QR code data
   * @returns true if valid ResXperience QR code format
   */
  isValidResXQRCode(qrData: string): boolean {
    return this.parseResXQRCode(qrData) !== null;
  }
}
