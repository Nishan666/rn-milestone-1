// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { loadFonts, loadAssets } from './utils/fontLoader';
import SplashScreen from './components/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const [profileDetails, setProfileDetails] = useState(null)

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

  // Don't render anything until fonts and assets are loaded
  if (!fontsLoaded || !assetsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show splash screen or main app based on state
  return (
    <SafeAreaProvider>
      {splashFinished ? (
        <AppNavigator setProfileDetails={setProfileDetails} profileDetails={profileDetails} />
      ) : (
        <SplashScreen onFinish={() => setSplashFinished(true)} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});