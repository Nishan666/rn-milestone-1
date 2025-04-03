import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

// Request Android notification permissions
const requestAndroidPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    } catch (error) {
      console.error('Android permission request failed:', error);
    }
  }
};

// Configure Expo notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Initialize notification channels for Android
const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    const channelId = 'default-channel';
    const channelExists = await Notifications.getNotificationChannelAsync(channelId)
      .then((channel) => !!channel)
      .catch(() => false);
    
    if (!channelExists) {
      await Notifications.setNotificationChannelAsync(channelId, {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: true,
      });
      console.log('Notification channel created');
    }
  }
};

// Separate component that can use Redux
function AppContent() {
  const { assetsLoaded, fontsLoaded, splashFinished, setSplashFinished, authenticated } =
    useMainModel();

  const { theme } = useSettingsViewModel();
  const [initialPermissionsChecked, setInitialPermissionsChecked] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);

  // Check initial permissions
  useEffect(() => {
    const checkInitialPermissions = async () => {
      try {
        // Check if we've asked for permissions before
        const storedLocationPermission = await AsyncStorage.getItem('locationPermission');
        const storedNotificationPermission = await AsyncStorage.getItem('notificationPermission');

        // Only request permissions if they haven't been asked for yet
        if (storedLocationPermission === null) {
          const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
          await AsyncStorage.setItem(
            'locationPermission',
            JSON.stringify(locationStatus === 'granted'),
          );
        }

        if (storedNotificationPermission === null) {
          const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
          await AsyncStorage.setItem(
            'notificationPermission',
            JSON.stringify(notificationStatus === 'granted'),
          );
        }
      } catch (error) {
        console.error('Error checking initial permissions:', error);
      } finally {
        setInitialPermissionsChecked(true);
      }
    };

    checkInitialPermissions();
  }, []);

  // Request Firebase Messaging permission
  const requestUserPermission = async () => {
    try {
      // Request Android notification permissions
      await requestAndroidPermissions();
      
      // Request FCM permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        console.log('Firebase Authorization status:', authStatus);
        return true;
      } else {
        console.log('Firebase Authorization denied');
        return false;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  // Get FCM token
  const getFCMToken = async () => {
    try {
      // Check if token exists in AsyncStorage
      const savedToken = await AsyncStorage.getItem('fcmToken');
      
      // Get the token
      const token = await messaging().getToken();
      
      // Save the token if it's different
      if (savedToken !== token) {
        await AsyncStorage.setItem('fcmToken', token);
      }
      
      console.log('FCM Token:', token);
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  };
  
  // Function to handle received notifications
  const setupNotificationListeners = () => {
    console.log('Setting up notification listeners');
    
    // Create Android notification channel
    createNotificationChannel();
    
    // Handle messages received while app is in foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      
      // Display a notification using Expo Notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || 'New Notification',
          body: remoteMessage.notification?.body || '',
          data: remoteMessage.data || {},
        },
        trigger: null, // Show immediately
      });
    });
  
    // Handle notification opened when app was in background
    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage);
      // Here you can navigate based on notification data
      // navigation.navigate(remoteMessage.data.screen);
    });
  
    // Check if app was opened from a notification when app was closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened by notification (closed state):', remoteMessage);
          // Here you can navigate based on notification data
        }
      })
      .catch(error => {
        console.error('getInitialNotification error:', error);
      });
    
    // Handle token refresh
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async token => {
      console.log('FCM token refreshed:', token);
      await AsyncStorage.setItem('fcmToken', token);
      setFcmToken(token);
      
      // Here you could update your backend with the new token
    });
  
    // Return unsubscribe functions for cleanup
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
      unsubscribeOnTokenRefresh();
    };
  };
  
  // Subscribe to topic-based notifications
  const subscribeToTopic = async (topic) => {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
      
      // Save subscribed topics in AsyncStorage
      const savedTopics = await AsyncStorage.getItem('subscribedTopics');
      const topics = savedTopics ? JSON.parse(savedTopics) : [];
      
      if (!topics.includes(topic)) {
        topics.push(topic);
        await AsyncStorage.setItem('subscribedTopics', JSON.stringify(topics));
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      return false;
    }
  };

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      try {
        // Initialize permissions
        const permissionEnabled = await requestUserPermission();
        
        if (permissionEnabled) {
          // Get FCM token
          const token = await getFCMToken();
          
          // Subscribe to general topic
          await subscribeToTopic('general');
          
          console.log('Notification setup complete. Token:', token);
        }
      } catch (error) {
        console.error('Notification initialization error:', error);
      }
    };
    
    // Set up listeners and initialize
    initNotifications();
    const unsubscribeListeners = setupNotificationListeners();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribeListeners === 'function') {
        unsubscribeListeners();
      }
    };
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
  },
});

const themeStyles = StyleSheet.create({
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#121212', // Dark theme background
  },
});