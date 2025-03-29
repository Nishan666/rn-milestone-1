import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNicknameViewModel } from '../viewModels/useNicknameViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const NicknameForm: React.FC = () => {
  const { handleSubmit, errors, nickname, setNickname, setErrors } = useNicknameViewModel();
  const { theme, t } = useSettingsViewModel();
  
  // Get theme colors based on the current theme
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{t('welcome')}</Text>
        <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
          {t('createProfile')}
        </Text>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.text }]}>{t('nickname')}</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground
              },
              errors.nickname ? [styles.inputError, { borderColor: themeColors.error }] : null
            ]}
            value={nickname}
            onChangeText={text => {
              setNickname(text);
              if (errors.nickname) setErrors(prev => ({ ...prev, nickname: undefined }));
            }}
            placeholder={t('enterNickname')}
            placeholderTextColor={themeColors.placeholder}
          />
          {errors.nickname && <Text style={[styles.error, { color: themeColors.error }]}>{t(errors.nickname)}</Text>}
        </View>
        <Pressable 
          style={[styles.button, { backgroundColor: themeColors.primary }]} 
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t('save')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Theme definitions
const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  secondaryText: '#666666',
  border: '#dddddd',
  inputBackground: '#ffffff',
  primary: '#007bff',
  buttonText: '#ffffff',
  error: '#ff0000',
  placeholder: '#999999',
};

const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#444444',
  inputBackground: '#222222',
  primary: '#0a84ff',
  buttonText: '#ffffff',
  error: '#ff6b6b',
  placeholder: '#777777',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 2,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NicknameForm;