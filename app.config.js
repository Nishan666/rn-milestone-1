const VERSION = '1.0.0';

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
      bundleIdentifier: "com.jack.environmentpro.dev",
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: "com.yourcompany.environmentpro.dev",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/dev/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: "https://dev-api.yourapp.com"
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
      bundleIdentifier: "com.yourcompany.environmentpro.staging",
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: "com.yourcompany.environmentpro.staging",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/staging/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: "https://staging-api.yourapp.com"
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
      bundleIdentifier: "com.yourcompany.environmentpro.preprod",
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: "com.yourcompany.environmentpro.preprod",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/preprod/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: "https://preprod-api.yourapp.com"
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
      bundleIdentifier: "com.yourcompany.environmentpro",
      buildNumber: VERSION,
      supportsTablet: true
    },
    android: {
      package: "com.yourcompany.environmentpro",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icons/prod/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      apiUrl: "https://api.yourapp.com"
    }
  }
};

// Export dynamic configuration
export default ({ config }) => {
  const env = process.env.APP_ENV || 'development';
  console.log(`Building app for ${env} environment`);
  
  return {
    ...baseConfig,
    ...envConfig[env]
  };
};