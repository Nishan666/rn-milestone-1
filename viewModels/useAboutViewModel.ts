import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

export const useAboutViewModel = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  return {
    appName,
    environment,
    icon,
  };
};
