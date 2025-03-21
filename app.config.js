const VERSION = '1.0.0';

import * as dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.stage || 'development';
const API_URL = process.env.api || 'https://dev-api.yourapp.com';
const ANDROID_PACKAGE = process.env.package || 'com.yourcompany.environmentpro.dev';
const IOS_BUNDLE = process.env.bundle || 'com.jack.environmentpro.dev';

// Shared base configuration
const baseConfig = {
  name: "environment-pro",
  slug: "environment-pro",
  version: VERSION,
};

// Environment-specific configurations
const envConfig = {
  development: {
    name: "Environment Dev",
    icon: "./assets/icons/dev/icon.png",
    splash: {
      image: "./assets/icons/dev/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: IOS_BUNDLE,
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: ANDROID_PACKAGE,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/dev/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: API_URL,
      eas: {
        projectId: "63bbcc7d-3f48-435d-aad3-7c0165d80e0c"
      }
    }
  },
  staging: {
    name: "Environment Staging",
    icon: "./assets/icons/staging/icon.png",
    splash: {
      image: "./assets/icons/staging/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: IOS_BUNDLE,
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: ANDROID_PACKAGE,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/staging/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: API_URL,
      eas: {
        projectId: "63bbcc7d-3f48-435d-aad3-7c0165d80e0c"
      }
    }
  },
  preproduction: {
    name: "Environment PreProd",
    icon: "./assets/icons/preprod/icon.png",
    splash: {
      image: "./assets/icons/preprod/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: IOS_BUNDLE,
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: ANDROID_PACKAGE,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/preprod/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: API_URL,
      eas: {
        projectId: "63bbcc7d-3f48-435d-aad3-7c0165d80e0c"
      }
    }
  },
  production: {
    name: "Environment Pro",
    icon: "./assets/icons/prod/icon.png",
    splash: {
      image: "./assets/icons/prod/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: IOS_BUNDLE,
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: ANDROID_PACKAGE,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/prod/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: API_URL,
      eas: {
        projectId: "63bbcc7d-3f48-435d-aad3-7c0165d80e0c"
      }
    }
  }
};

// Export dynamic configuration
export default ({ config }) => {
  console.log(`Building app for ${ENV} environment`);
  return {
    stage : ENV,
    ...baseConfig,
    ...envConfig[ENV]
  };
};