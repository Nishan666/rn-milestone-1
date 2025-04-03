import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import SplashScreen from './components/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './store';
import { useMainModel } from './viewModels/useMainModel';
import { useSettingsViewModel } from './viewModels/useSettingsViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Separate component that can use Redux
function AppContent() {
  const {
    assetsLoaded,
    fontsLoaded,
    splashFinished,
    setSplashFinished,
    authenticated,
  } = useMainModel();
  
  const { theme } = useSettingsViewModel();
  const [initialPermissionsChecked, setInitialPermissionsChecked] = useState(false);

  useEffect(() => {
    const checkInitialPermissions = async () => {
      try {
        // Check if we've asked for permissions before
        const storedLocationPermission = await AsyncStorage.getItem('locationPermission');
        const storedNotificationPermission = await AsyncStorage.getItem('notificationPermission');

        // If we haven't asked yet, request permissions
        if (storedLocationPermission === null) {
          const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
          await AsyncStorage.setItem('locationPermission', JSON.stringify(locationStatus === 'granted'));
        }

        if (storedNotificationPermission === null) {
          const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
          await AsyncStorage.setItem('notificationPermission', JSON.stringify(notificationStatus === 'granted'));
        }
      } catch (error) {
        console.error('Error checking initial permissions:', error);
      } finally {
        setInitialPermissionsChecked(true);
      }
    };

    checkInitialPermissions();
  }, []);

  if (!fontsLoaded || !assetsLoaded || !initialPermissionsChecked) {
    return (
      <View style={[styles.loadingContainer, themeStyles[theme]]}>
        <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#007bff'} />
      </View>
    );
  }

  return splashFinished && authenticated ? (
    <AppNavigator />
  ) : (
    <SplashScreen setSplashFinished={setSplashFinished} />
  );
}

// Main App component that provides Redux
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const themeStyles = StyleSheet.create({
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#121212', // Dark theme background
  },
});