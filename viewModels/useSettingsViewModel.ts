import { useState } from 'react';

export const useSettingsViewModel = () => {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [location, setLocation] = useState<boolean>(true);
  return {
    notifications,
    setNotifications,
    darkMode,
    setDarkMode,
    location,
    setLocation,
  };
};
