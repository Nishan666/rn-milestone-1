// components/SplashScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSplashViewModel } from '../viewModels/useSplashViewModel';
import { SplashScreenProps } from '../models/types';

const SplashScreen : React.FC<SplashScreenProps> = ({ setSplashFinished }) => {
  const { appName, loadingProgress, splash } = useSplashViewModel({ setSplashFinished });
  return (
    <View style={styles.splashContainer}>
      <Image source={splash} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appTitle}>{appName}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${loadingProgress * 100}%` }]} />
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
