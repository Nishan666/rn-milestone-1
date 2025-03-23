import { useEffect, useState } from 'react';
import { loadAssets, loadFonts } from '../utils/fontLoader';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { loadRoom } from '../store/slices/roomSlice';
import { loadProfile } from '../store/slices/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { set } from 'react-hook-form';

export const useMainModel = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Load custom fonts and assets
  useEffect(() => {
    async function loadResources() {
      try {
        await loadFonts();
        setFontsLoaded(true);

        await loadAssets();
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    }
    loadResources();
  }, []);

  useEffect(() => {
    dispatch(loadProfile());
    dispatch(loadRoom());
  }, [dispatch]);

  const checkUserLoggedIn = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometrics');

    if (biometricEnabled === 'true') {
      // Check if the device supports authentication
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        console.log('Biometrics not available');
        setAuthenticated(true);
        return;
      }

      // Prompt for biometrics with fallback to device PIN/password
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use device passcode',
        disableDeviceFallback: false, // Allow fallback to PIN/password
      });

      if (result.success) {
        console.log('Authentication successful');
        setAuthenticated(true);
      } else {
        console.log('Authentication failed');
        Alert.alert(
          'Authentication Failed',
          'Please authenticate to continue.',
          [
            {
              text: 'OK',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false },
        );
      }
    }else{
      setAuthenticated(true);}
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return {
    fontsLoaded,
    splashFinished,
    assetsLoaded,
    setSplashFinished,
    authenticated
  };
};
