import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

export const useDrawerContentViewModel = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  return {
    appName,
    environment,
    icon,
  };
};
