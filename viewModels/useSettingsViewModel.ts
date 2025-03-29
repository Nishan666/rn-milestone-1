import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, selectTheme, setLanguage, setTheme } from '../store/slices/themeLangSlice';
import { useTranslation } from 'react-i18next';
import i18n from '../localization/i18n';

export const useSettingsViewModel = () => {
  const { t } = useTranslation();
  const [biometrics, setBiometrics] = useState<boolean>(false);

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  useEffect(() => {
    const loadSettings = async () => {
      const storedBiometrics = await AsyncStorage.getItem('biometrics');

      if (storedBiometrics !== null) setBiometrics(JSON.parse(storedBiometrics));
    };

    loadSettings();
  }, []);

  const toggleBiometrics = async () => {
    const newValue = !biometrics;
    setBiometrics(newValue);
    await AsyncStorage.setItem('biometrics', JSON.stringify(newValue));
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
    t,
  };
};
