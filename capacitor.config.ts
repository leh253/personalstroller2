import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.personal_products_co.personal_stroller', // Retour à l'ID original pour mise à jour
  appName: 'Personal Stroller',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#151b2b",
      showSpinner: false,
      androidSplashResourceName: "splash",
      iosSplashResourceName: "Default"
    }
  }
};

export default config;