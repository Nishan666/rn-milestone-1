import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getEnvironment } from '../utils/environment';

const HomeScreen = () => {
  const { appName } = getEnvironment();
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to {appName}</Text>
      <Text style={styles.subheading}>Home Screen</Text>
      <Text style={styles.text}>This is the main screen of your application.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginBottom: 20,
    color: '#4CAF50',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;