// utils/fontLoader.ts
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { getEnvironmentAssets } from './environment';

export const loadFonts = async (): Promise<void> => {
  await Font.loadAsync({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  });
};

export const loadAssets = async (): Promise<void> => {
  const { icon, splash } = getEnvironmentAssets();
  await Asset.loadAsync([icon, splash]);
};
