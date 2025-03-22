// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text } from 'react-native';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';

const DrawerContent = (props : any) => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={icon}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>{appName}</Text>
        <View style={styles.envBadge}>
          <Text style={styles.envText}>{environment}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
    alignItems: 'center',
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