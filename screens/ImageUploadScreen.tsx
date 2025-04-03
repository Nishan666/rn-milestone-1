import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { useImageUploadScreenViewModel } from '../viewModels/useImageUploadScreenViewModel';
import baseColors from '../utils/colorSchema';

export default function ImageUploadScreen() {
  const { isAuthenticated, token, setToken, handleLogin, isLoading, image, pickImage, uploadImage, uploadStatus, t, theme } = useImageUploadScreenViewModel()
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>{t('s3ImageUploader')}</Text>

      {!isAuthenticated ? (
        <View style={[styles.authContainer, { backgroundColor: themeColors.cardBackground, shadowColor: themeColors.shadow }]}>
          <Text style={[styles.label, { color: themeColors.text }]}>{t('enterBearerToken')}</Text>
          <TextInput
            style={[styles.input, {
              borderColor: themeColors.border,
              backgroundColor: themeColors.inputBackground,
              color: themeColors.text
            }]}
            value={token}
            onChangeText={setToken}
            placeholder={t('pasteBearerToken')}
            placeholderTextColor={themeColors.placeholder}
            secureTextEntry
          />
          <Pressable
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            disabled={isLoading}
            onPress={handleLogin}
          >
            <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t('login')}</Text>
          </Pressable>
          {isLoading && <ActivityIndicator style={styles.loader} size="small" color={themeColors.primary} />}
        </View>
      ) : (
        <View style={[styles.uploadContainer, {
          backgroundColor: themeColors.cardBackground,
          shadowColor: themeColors.shadow
        }]}>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: themeColors.primary }]}
              disabled={isLoading}
              onPress={pickImage}
            >
              <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t('pickImage')}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: image ? themeColors.primary : themeColors.disabledButton,
                  opacity: (isLoading || !image) ? 0.7 : 1
                }
              ]}
              disabled={isLoading || !image}
              onPress={uploadImage}
            >
              <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t('uploadImage')}</Text>
            </Pressable>
          </View>

          {isLoading && <ActivityIndicator size="large" color={themeColors.primary} />}
          <Text style={[styles.status, { color: themeColors.secondaryText }]}>{uploadStatus}</Text>
        </View>
      )}
    </View>
  );
}

// Theme definitions
const lightTheme = {
  background:  baseColors.grey100,
  cardBackground:  baseColors.white,
  text:  baseColors.black,
  secondaryText: '#555555',
  border: '#dddddd',
  shadow:  baseColors.black,
  inputBackground:  baseColors.white,
  placeholder: '#999999',
  primary: '#007bff',
  disabledButton: '#cccccc',
  buttonText:  baseColors.white,
};

const darkTheme = {
  background: '#121212',
  cardBackground: '#1e1e1e',
  text:  baseColors.white,
  secondaryText: '#aaaaaa',
  border: '#444444',
  shadow:  baseColors.black,
  inputBackground: '#2c2c2c',
  placeholder: '#777777',
  primary: '#0a84ff',
  disabledButton: '#555555',
  buttonText:  baseColors.white,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  authContainer: {
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 10,
  },
  uploadContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#e1e1e1',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  status: {
    marginTop: 20,
    textAlign: 'center',
  },
});