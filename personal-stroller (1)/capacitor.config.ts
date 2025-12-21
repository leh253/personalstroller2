import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ID corrigé (sans tirets) pour valider la configuration Capacitor
  appId: 'com.personalproducts.personalstroller', 
  
  appName: 'Personal Stroller',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always'
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