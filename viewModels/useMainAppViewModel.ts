import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

export const useMainAppViewModel = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  return {
    appName,
    environment,
    icon,
  };
};
