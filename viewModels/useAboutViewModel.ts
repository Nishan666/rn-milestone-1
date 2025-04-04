import DeviceInfo from 'react-native-device-info';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

export const useAboutViewModel = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  const version = DeviceInfo.getVersion();
  return {
    appName,
    environment,
    icon,
    version
  };
};
