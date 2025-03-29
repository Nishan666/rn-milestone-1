import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const SettingsScreen: React.FC = () => {
  const { biometrics, toggleBiometrics, theme, language, toggleTheme, toggleLanguage, t } = useSettingsViewModel();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
      <Text style={[styles.heading, theme === 'dark' && styles.darkText]}>{t('settings')}</Text>

      {/* Dark Mode Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('darkMode')}</Text>
        </View>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>

      {/* Language Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="language-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('language')}</Text>
        </View>
        <Switch value={language === 'fr'} onValueChange={toggleLanguage} />
      </View>

      {/* Biometrics Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="finger-print-outline" size={24} color={theme === 'dark' ? "#FFF" : "#333"} />
          <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>{t('biometric')}</Text>
        </View>
        <Switch value={biometrics} onValueChange={toggleBiometrics} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  darkMode: { backgroundColor: '#333' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#333' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 16, marginLeft: 10, color: '#333' },
  darkText: { color: '#FFF' },
});

export default SettingsScreen;