import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, selectTheme, setLanguage, setTheme } from '../store/slices/themeLangSlice';
import { useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform, Linking, Alert } from 'react-native';

export const useSettingsViewModel = () => {
  const { t } = useTranslation();
  const [biometrics, setBiometrics] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    const loadSettings = async () => {
      // Load existing settings from AsyncStorage
      const storedBiometrics = await AsyncStorage.getItem('biometrics');
      if (storedBiometrics !== null) setBiometrics(JSON.parse(storedBiometrics));
      
      // Check actual permission statuses (not just stored values)
      checkLocationPermission();
      checkNotificationPermission();
    };
    
    loadSettings();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const isGranted = status === 'granted';
      setLocationPermission(isGranted);
      await AsyncStorage.setItem('locationPermission', JSON.stringify(isGranted));
      
      // If permission is granted, fetch location
      if (isGranted) {
        fetchLocation();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const isGranted = status === 'granted';
      setNotificationPermission(isGranted);
      await AsyncStorage.setItem('notificationPermission', JSON.stringify(isGranted));
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

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
        // Alert the user if permission was denied
        Alert.alert(
          t('permissionRequired'),
          t('locationPermissionNeeded'),
          [
            { text: t('cancel'), style: 'cancel' },
            { 
              text: t('settings'), 
              onPress: openAppSettings 
            }
          ]
        );
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
      
      // Only ask if permissions have not been determined or denied
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      const isGranted = finalStatus === 'granted';
      setNotificationPermission(isGranted);
      await AsyncStorage.setItem('notificationPermission', JSON.stringify(isGranted));
      
      if (!isGranted) {
        // Alert the user if permission was denied
        Alert.alert(
          t('permissionRequired'),
          t('notificationPermissionNeeded'),
          [
            { text: t('cancel'), style: 'cancel' },
            { 
              text: t('settings'), 
              onPress: openAppSettings 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Open device settings using just Linking API
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openSettings();
    } else {
      // For Android, open app settings
      Linking.openSettings();
    }
  };

  const toggleBiometrics = async () => {
    const newValue = !biometrics;
    setBiometrics(newValue);
    await AsyncStorage.setItem('biometrics', JSON.stringify(newValue));
  };

  const toggleLocationPermission = async () => {
    if (locationPermission) {
      // If turning off (can't actually turn off permissions programmatically)
      Alert.alert(
        t('disableLocationTitle'),
        t('disableLocationMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          { 
            text: t('settings'), 
            onPress: openAppSettings 
          }
        ]
      );
    } else {
      // If turning on, request permission
      await requestLocationPermission();
      // Refresh permission status
      await checkLocationPermission();
    }
  };

  const toggleNotificationPermission = async () => {
    if (notificationPermission) {
      // If turning off (can't actually turn off permissions programmatically)
      Alert.alert(
        t('disableNotificationsTitle'),
        t('disableNotificationsMessage'),
        [
          { text: t('cancel'), style: 'cancel' },
          { 
            text: t('settings'), 
            onPress: openAppSettings 
          }
        ]
      );
    } else {
      // If turning on, request permission
      await requestNotificationPermission();
      // Refresh permission status
      await checkNotificationPermission();
    }
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
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