import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useColorScheme } from 'react-native';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

const AboutScreen: React.FC = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  const colorScheme = useColorScheme(); 


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={icon} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>{appName}</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={[styles.envBadge, environment === 'production' ? styles.envProd : styles.envDev]}>
          <Text style={styles.envText}>{environment.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={styles.paragraph}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book.
        </Text>
      </View>
    </ScrollView>
  );
};

// Styles with TypeScript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 5,
    color: '#000',
  },
  version: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  envBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  envProd: {
    backgroundColor: '#4CAF50', // Green for production
  },
  envDev: {
    backgroundColor: '#FF9800', // Orange for development
  },
  envText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  paragraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default AboutScreen;
