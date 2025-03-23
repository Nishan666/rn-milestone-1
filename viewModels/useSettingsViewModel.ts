import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export const useSettingsViewModel = () => {
  const [notifications, setNotifications] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [location, setLocation] = useState<boolean>(false);
  const [biometrics, setBiometrics] = useState<boolean>(false);

  const toggleBiometrics = async () => {
    if (biometrics) {
      await AsyncStorage.removeItem('biometrics');
      return;
    } else {
      setBiometrics(!biometrics);
      await AsyncStorage.setItem('biometrics', JSON.stringify(!biometrics));
    }
  };

  return {
    notifications,
    setNotifications,
    darkMode,
    setDarkMode,
    location,
    setLocation,
    toggleBiometrics,
    biometrics,
  };
};
