import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const SettingsScreen: React.FC = () => {
  const {
    darkMode,
    location,
    notifications,
    setDarkMode,
    setLocation,
    setNotifications,
    biometrics,
    toggleBiometrics,
  } = useSettingsViewModel();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Notifications</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={darkMode ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Location Services</Text>
        </View>
        <Switch
          value={location}
          onValueChange={setLocation}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={location ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Biometrics</Text>
        </View>
        <Switch
          value={biometrics}
          onValueChange={toggleBiometrics}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Reset Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;
