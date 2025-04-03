import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const SettingsScreen = () => {
  const { 
    biometrics, 
    toggleBiometrics, 
    theme, 
    language, 
    toggleTheme, 
    toggleLanguage, 
    locationPermission,
    notificationPermission,
    toggleLocationPermission,
    toggleNotificationPermission,
    currentLocation,
    isLoadingLocation,
    t 
  } = useSettingsViewModel();

  return (
    <ScrollView style={[styles.container, theme === 'dark' && styles.darkMode]}>
      <Text style={[styles.heading, theme === 'dark' && styles.darkText]}>{t('settings')}</Text>
      
      {/* Dark Mode Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('darkMode')}</Text>
        </View>
        <Switch 
          value={theme === 'dark'} 
          onValueChange={toggleTheme} 
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {/* Language Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="language-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('language')}</Text>
        </View>
        <Switch 
          value={language === 'fr'} 
          onValueChange={toggleLanguage}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={language === 'fr' ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {/* Biometrics Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="finger-print-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('biometric')}</Text>
        </View>
        <Switch 
          value={biometrics} 
          onValueChange={toggleBiometrics}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={biometrics ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {/* Notification Permission Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>
            {t('notifications')}
          </Text>
        </View>
        <Switch 
          value={notificationPermission} 
          onValueChange={toggleNotificationPermission}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationPermission ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {/* Location Permission Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="location-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>
            {t('location')}
          </Text>
        </View>
        <Switch 
          value={locationPermission} 
          onValueChange={toggleLocationPermission}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={locationPermission ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {/* Location Information Section */}
      {locationPermission && (
        <View style={[styles.locationContainer, theme === 'dark' && styles.darkLocationContainer]}>
          <Text style={[styles.locationTitle, theme === 'dark' && styles.darkText]}>
            {t('currentLocation')}
          </Text>
          
          {isLoadingLocation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme === 'dark' ? "#81b0ff" : "#0066cc"} />
              <Text style={[styles.loadingText, theme === 'dark' && styles.darkText]}>
                {t('fetchingLocation')}
              </Text>
            </View>
          ) : currentLocation ? (
            <View style={styles.locationCoords}>
              <Text style={[styles.locationText, theme === 'dark' && styles.darkText]}>
                {t('latitude')}: {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text style={[styles.locationText, theme === 'dark' && styles.darkText]}>
                {t('longitude')}: {currentLocation.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.locationText, theme === 'dark' && styles.darkText]}>
              {t('locationUnavailable')}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#FFF' 
  },
  darkMode: { 
    backgroundColor: '#121212' 
  },
  heading: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333',
    fontFamily: 'Poppins-Bold'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  settingText: { 
    fontSize: 16, 
    marginLeft: 10, 
    color: '#333',
    fontFamily: 'Poppins-Regular'
  },
  darkText: { 
    color: '#FFF' 
  },
  locationContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkLocationContainer: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins-Bold'
  },
  locationCoords: {
    marginLeft: 10,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
    fontFamily: 'Poppins-Regular'
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular'
  }
});

export default SettingsScreen;