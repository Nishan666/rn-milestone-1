import { useEffect, useState } from 'react';
import { loadAssets, loadFonts } from '../utils/fontLoader';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { loadRoom } from '../store/slices/roomSlice';
import { loadProfile } from '../store/slices/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { loadThemeLang } from '../store/slices/themeLangSlice';

export const useMainModel = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
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

  const loadSettings = async () => {
    const storedTheme = (await AsyncStorage.getItem('theme')) || 'light';
    const storedLanguage = (await AsyncStorage.getItem('language')) || 'en';

    dispatch(loadThemeLang({ theme: storedTheme as 'light' | 'dark', language: storedLanguage as 'en' | 'fr' }));
  };

  useEffect(() => {
    dispatch(loadProfile());
    dispatch(loadRoom());
    loadSettings();
  }, [dispatch]);

  const checkUserLoggedIn = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometrics');
    const language = await AsyncStorage.getItem('language');
    const theme = await AsyncStorage.getItem('theme');

    if (biometricEnabled === 'true') {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        console.log('Biometrics not available');
        setAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use device passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log('Authentication successful');
        setAuthenticated(true);
        setAuthFailed(false);
      } else {
        console.log('Authentication failed');
        setAuthFailed(true); // Set failure flag
        Alert.alert(
          'Authentication Failed',
          'Would you like to try again?',
          [
            {
              text: 'Retry',
              onPress: retryAuthentication,
            },
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false },
        );
      }
    } else {
      setAuthenticated(true);
    }
  };

  const retryAuthentication = async () => {
    setAuthFailed(false);
    await checkUserLoggedIn();
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return {
    fontsLoaded,
    splashFinished,
    assetsLoaded,
    setSplashFinished,
    authenticated,
  };
};
