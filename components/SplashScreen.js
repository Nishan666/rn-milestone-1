// components/SplashScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

const SplashScreen = ({ onFinish }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { appName } = getEnvironment();
  const { splash } = getEnvironmentAssets();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 0.1;
        if (newProgress >= 1) {
          clearInterval(interval);
          // Add a small delay before finishing
          setTimeout(() => {
            onFinish();
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={splash}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appTitle}>{appName}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${loadingProgress * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.loadingText}>Loading... {Math.floor(loadingProgress * 100)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});

export default SplashScreen;