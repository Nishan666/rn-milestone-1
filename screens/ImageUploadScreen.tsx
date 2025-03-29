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
import * as ImagePicker from 'expo-image-picker';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

export default function ImageUploadScreen() {
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Get theme and translations
  const { theme, t } = useSettingsViewModel();
  
  // Get theme colors based on current theme
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  // API endpoint
  const API_URL = 'https://vevl7yryx5oh4ippc7ub3sgjwe0liphz.lambda-url.us-east-1.on.aws/';

  // Function to handle login with token
  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert(t('error'), t('enterValidToken'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setUploadStatus(t('loginSuccess'));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || t('invalidToken'));
      }
    } catch (error: any) {
      Alert.alert(t('authError'), error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(t('permissionRequired'), t('photoAccessNeeded'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setUploadStatus(t('imageSelected'));
    }
  };

  // Function to get a presigned URL and upload the image
  const uploadImage = async () => {
    if (!image) {
      Alert.alert(t('error'), t('selectImageFirst'));
      return;
    }

    setIsLoading(true);
    setUploadStatus(t('gettingPresignedUrl'));

    try {
      const filename = `image_${Date.now()}.jpg`;
      const response = await fetch(
        `${API_URL}?filename=${filename}&contentType=image/jpeg`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t('failedToGetUrl'));
      }

      const presignedUrl: string = data.presignedUrl;
      setUploadStatus(t('uploadingToS3'));

      const imageResponse = await fetch(image);
      const blob = await imageResponse.blob();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (uploadResponse.ok) {
        setUploadStatus(t('uploadSuccess'));
        const imageUrl = presignedUrl.split('?')[0];
        Alert.alert(t('success'), `${t('uploadSuccessMessage')}\n${t('filename')}: ${data.filename}`);
      } else {
        throw new Error(t('failedToUpload'));
      }
    } catch (error: any) {
      setUploadStatus(`${t('error')}: ${error.message}`);
      Alert.alert(t('uploadError'), error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  text: '#000000',
  secondaryText: '#555555',
  border: '#dddddd',
  shadow: '#000000',
  inputBackground: '#ffffff',
  placeholder: '#999999',
  primary: '#007bff',
  disabledButton: '#cccccc',
  buttonText: '#ffffff',
};

const darkTheme = {
  background: '#121212',
  cardBackground: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#444444',
  shadow: '#000000',
  inputBackground: '#2c2c2c',
  placeholder: '#777777',
  primary: '#0a84ff',
  disabledButton: '#555555',
  buttonText: '#ffffff',
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