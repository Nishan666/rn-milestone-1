// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text } from 'react-native';
import { useDrawerContentViewModel } from '../viewModels/useDrawerContentViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const DrawerContent = (props: any) => {
  const { theme, t } = useSettingsViewModel();
  const { icon, appName, environment } = useDrawerContentViewModel();
  
  const isDark = theme === 'dark';

  return (
    <DrawerContentScrollView 
      {...props} 
      style={isDark ? styles.darkScrollView : styles.scrollView}
    >
      <View style={[styles.drawerHeader, isDark && styles.darkDrawerHeader]}>
        <Image source={icon} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.appName, isDark && styles.darkText]}>{appName}</Text>
        <View style={styles.envBadge}>
          <Text style={styles.envText}>{t('environment')}: {environment}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
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
});

export default DrawerContent;