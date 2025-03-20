import Constants from 'expo-constants';

export const getEnvironment = () => {
  const { name, extra = {}, stage } = Constants.expoConfig || {};

  return {
    appName: name,
    apiUrl: extra.apiUrl,
    environment: stage || 'development',
    isProduction: (stage || 'development') === 'production',
    isDevelopment: (stage || 'development') === 'development',
    isStaging: (stage || 'development') === 'staging',
    isPreProduction: (stage || 'development') === 'preproduction'
  };
};

export const getEnvironmentAssets = () => {
  const { environment } = getEnvironment();
  
  const icons = {
    development: require('../assets/icons/dev/icon.png'),
    staging: require('../assets/icons/staging/icon.png'),
    preproduction: require('../assets/icons/preprod/icon.png'),
    production: require('../assets/icons/prod/icon.png')
  };
  
  const splashes = {
    development: require('../assets/icons/dev/splash.png'),
    staging: require('../assets/icons/staging/splash.png'),
    preproduction: require('../assets/icons/preprod/splash.png'),
    production: require('../assets/icons/prod/splash.png')
  };
  
  return {
    icon: icons[environment] || icons.development,
    splash: splashes[environment] || splashes.development
  };
};