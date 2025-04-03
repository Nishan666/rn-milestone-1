import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useProfileViewModel } from '../viewModels/useProfileViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';
import baseColors from '../utils/colorSchema';

const ProfileScreen = () => {
  const { handleEdit, profile } = useProfileViewModel();
  const { theme, t } = useSettingsViewModel();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
      <Text style={[styles.heading, theme === 'dark' && styles.darkText]}>{t('profile')}</Text>
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>{t('profile_description')}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>{t('nickname')}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.value}>{profile?.nickname || '-'}</Text>
          <Pressable style={styles.button} onPress={handleEdit}>
            <Text>{profile?.nickname ? t('edit') : t('create')}</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>{t('email')}</Text>
        <Text style={styles.value}>{profile?.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  darkMode: { backgroundColor: '#333' },
  heading: { fontSize: 24, marginBottom: 20, color: '#333' },
  darkText: { color: '#FFF' },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  infoBox: { backgroundColor:  baseColors.grey100, borderRadius: 10, padding: 20, width: '100%' },
  label: { fontSize: 14, color: '#666', marginTop: 10 },
  value: { fontSize: 16, color: '#333', marginVertical: 10 },
  button: { backgroundColor: '#007bff', borderRadius: 5, paddingHorizontal: 15, paddingTop:10 },
});

export default ProfileScreen;
