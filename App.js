import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import SplashScreen from './components/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './store';
import { useMainModel } from './viewModels/useMainModel';

// Separate component that can use Redux
function AppContent() {
  const {
    assetsLoaded,
    fontsLoaded,
    splashFinished,
    setSplashFinished,
    authenticated,
  } = useMainModel();

  if (!fontsLoaded || !assetsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return splashFinished && authenticated ? (
    <AppNavigator />
  ) : (
    <SplashScreen
      setSplashFinished={setSplashFinished}
    />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});