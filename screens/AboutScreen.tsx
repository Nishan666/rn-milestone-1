import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useAboutViewModel } from '../viewModels/useAboutViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';
import baseColors from '../utils/colorSchema';

const AboutScreen: React.FC = () => {
  const { appName, environment, icon, version } = useAboutViewModel();

  const { theme, t } = useSettingsViewModel();

  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Image source={icon} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.heading, isDark && styles.darkText]}>{appName}</Text>
        <Text style={[styles.version, isDark && styles.darkText]}>{version}</Text>
        <View
          style={[styles.envBadge, environment === 'production' ? styles.envProd : styles.envDev]}>
          <Text style={styles.envText}>{environment.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>{t('about_title')}</Text>
        <Text style={[styles.paragraph, isDark && styles.darkText]}>{t('about_description')}</Text>
      </View>
    </ScrollView>
  );
};

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
    backgroundColor:  baseColors.grey100,
  },
  darkHeader: {
    backgroundColor: '#1e1e1e',
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
  darkText: {
    color: '#fff',
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
    backgroundColor:  baseColors.success, // Green for production
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
