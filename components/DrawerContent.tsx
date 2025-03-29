// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text } from 'react-native';
import { useDrawerContentViewModel } from '../viewModels/useDrawerContentViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';
import LottieView from 'lottie-react-native';
import crashlytics from '@react-native-firebase/crashlytics';

const DrawerContent = (props: any) => {
  const { theme, t } = useSettingsViewModel();
  const { icon, appName, environment, handleLogout } = useDrawerContentViewModel();

  const isDark = theme === 'dark';

  return (
    <DrawerContentScrollView
      {...props}
      style={isDark ? styles.darkScrollView : styles.scrollView}
    >
      <View style={[styles.drawerHeader, isDark && styles.darkDrawerHeader]}>
        <LottieView
          style={styles.logo}
          source={require('../assets/lottie/logo.json')}
          autoPlay
          loop
        />
        <Text style={[styles.appName, isDark && styles.darkText]}>{appName}</Text>
        <View style={styles.envBadge}>
          <Text style={styles.envText}>{t('environment')}: {environment}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
            style={[styles.logoutButton, { marginTop: 10, backgroundColor: '#FF9800' }]} 
            onPress={() => crashlytics().crash()}
          >
            <Text style={styles.logoutText}>
              Test Crashlytics
            </Text>
          </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  darkScrollView: {
    backgroundColor: '#121212',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
    alignItems: 'center',
  },
  darkDrawerHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  envBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  envText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#fff',
  },
  logoutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
});

export default DrawerContent;