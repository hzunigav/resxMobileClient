import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.resxperience.app',
  appName: 'ResXperience',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    // For development, proxy to Spring Boot backend
    url: 'http://localhost:8080',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1E293B',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
