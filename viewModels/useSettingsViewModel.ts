import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, selectTheme, setLanguage, setTheme } from '../store/slices/themeLangSlice';
import { useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const useSettingsViewModel = () => {
  const { t } = useTranslation();
  const [biometrics, setBiometrics] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    const loadSettings = async () => {
      // Load existing settings from AsyncStorage
      const storedBiometrics = await AsyncStorage.getItem('biometrics');
      if (storedBiometrics !== null) setBiometrics(JSON.parse(storedBiometrics));
      
      // Load permission statuses
      const storedLocationPermission = await AsyncStorage.getItem('locationPermission');
      const storedNotificationPermission = await AsyncStorage.getItem('notificationPermission');
      
      if (storedLocationPermission !== null) {
        setLocationPermission(JSON.parse(storedLocationPermission));
        if (JSON.parse(storedLocationPermission)) {
          fetchLocation();
        }
      } else {
        // If no stored value, request permission
        requestLocationPermission();
      }
      
      if (storedNotificationPermission !== null) {
        setNotificationPermission(JSON.parse(storedNotificationPermission));
      } else {
        // If no stored value, request permission
        requestNotificationPermission();
      }
    };
    
    loadSettings();
  }, []);

  const fetchLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const isGranted = status === 'granted';
      setLocationPermission(isGranted);
      await AsyncStorage.setItem('locationPermission', JSON.stringify(isGranted));
      
      if (isGranted) {
        await fetchLocation();
      } else {
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setIsLoadingLocation(false);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // Only ask if permissions have not been determined
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      const isGranted = finalStatus === 'granted';
      setNotificationPermission(isGranted);
      await AsyncStorage.setItem('notificationPermission', JSON.stringify(isGranted));
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const toggleBiometrics = async () => {
    const newValue = !biometrics;
    setBiometrics(newValue);
    await AsyncStorage.setItem('biometrics', JSON.stringify(newValue));
  };

  const toggleLocationPermission = async () => {
    if (!locationPermission) {
      // If turning on, request permission
      await requestLocationPermission();
    } else {
      // If turning off, just update the state (cannot revoke permission programmatically)
      setLocationPermission(false);
      await AsyncStorage.setItem('locationPermission', JSON.stringify(false));
      setCurrentLocation(null);
    }
  };

  const toggleNotificationPermission = async () => {
    if (!notificationPermission) {
      // If turning on, request permission
      await requestNotificationPermission();
    } else {
      // If turning off, just update the state (cannot revoke permission programmatically)
      setNotificationPermission(false);
      await AsyncStorage.setItem('notificationPermission', JSON.stringify(false));
    }
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    dispatch(setLanguage(language === 'en' ? 'fr' : 'en'));
  };

  return {
    biometrics,
    toggleBiometrics,
    theme,
    language,
    toggleTheme,
    toggleLanguage,
    locationPermission,
    notificationPermission,
    toggleLocationPermission,
    toggleNotificationPermission,
    currentLocation,
    isLoadingLocation,
    t,
  };
};