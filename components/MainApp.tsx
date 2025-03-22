// components/MainApp.js
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

const MainApp = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();

  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Welcome to {appName}</Text>
      <Text style={styles.environmentText}>Environment: {environment}</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 10,
  },
  environmentText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
  },
});

export default MainApp;