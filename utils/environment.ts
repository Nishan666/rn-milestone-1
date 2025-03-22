import Constants from 'expo-constants';

interface EnvironmentConfig {
  appName?: string;
  apiUrl?: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isPreProduction: boolean;
}

export const getEnvironment = (): EnvironmentConfig => {
  const { name, extra = {} } = Constants.expoConfig || {};
  const env = extra.stage || 'development';

  return {
    appName: name,
    apiUrl: extra.apiUrl,
    environment: env,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    isStaging: env === 'staging',
    isPreProduction: env === 'preproduction',
  };
};

interface EnvironmentAssets {
  icon: any;
  splash: any;
}

export const getEnvironmentAssets = (): EnvironmentAssets => {
  const { environment } = getEnvironment();

  const icons: Record<string, any> = {
    development: require('../assets/icons/dev/icon.png'),
    staging: require('../assets/icons/staging/icon.png'),
    preproduction: require('../assets/icons/preprod/icon.png'),
    production: require('../assets/icons/prod/icon.png'),
  };

  const splashes: Record<string, any> = {
    development: require('../assets/icons/dev/splash.png'),
    staging: require('../assets/icons/staging/splash.png'),
    preproduction: require('../assets/icons/preprod/splash.png'),
    production: require('../assets/icons/prod/splash.png'),
  };

  return {
    icon: icons[environment] || icons.development,
    splash: splashes[environment] || splashes.development,
  };
};
