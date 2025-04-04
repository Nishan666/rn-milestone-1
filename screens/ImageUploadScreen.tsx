import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  FlatList
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useImageUploadScreenViewModel } from '../viewModels/useImageUploadScreenViewModel';

export default function ImageUploadScreen() {
  const { 
    isAuthenticated, 
    token, 
    setToken, 
    handleLogin, 
    isLoading, 
    image, 
    pickImage, 
    uploadImage, 
    uploadStatus, 
    uploadedImages,
    clearUploadHistory,
    t, 
    theme 
  } = useImageUploadScreenViewModel();
  
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  const renderImageItem = ({ item }) => (
    <View style={styles.imageItem}>
      <FastImage
        style={styles.thumbnailImage}
        source={{ uri: item }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.uploadContainer, {
            backgroundColor: themeColors.cardBackground,
            shadowColor: themeColors.shadow
          }]}>
            {image ? (
              <FastImage 
                source={{ uri: image }} 
                style={styles.imagePreview}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: themeColors.border }]}>
                <Text style={{ color: themeColors.secondaryText }}>{t('noImageSelected')}</Text>
              </View>
            )}

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

          {/* Previously uploaded images section */}
          {uploadedImages.length > 0 && (
            <View style={[styles.historyContainer, {
              backgroundColor: themeColors.cardBackground,
              shadowColor: themeColors.shadow
            }]}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: themeColors.text }]}>{t('uploadHistory')}</Text>
                <Pressable
                  style={[styles.clearButton, { backgroundColor: themeColors.danger }]}
                  onPress={() => {
                    Alert.alert(
                      t('confirm'),
                      t('clearHistoryConfirm'),
                      [
                        { text: t('cancel'), style: 'cancel' },
                        { text: t('clear'), onPress: clearUploadHistory }
                      ]
                    );
                  }}
                >
                  <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t('clearHistory')}</Text>
                </Pressable>
              </View>
              
              <FlatList
                data={uploadedImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => `image-${index}`}
                horizontal={false}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
              />
            </View>
          )}
        </ScrollView>
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
  danger: '#dc3545',
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
  danger: '#e74c3c',
  disabledButton: '#555555',
  buttonText: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 30,
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
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
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
  historyContainer: {
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  gridContainer: {
    paddingTop: 10,
  },
  imageItem: {
    flex: 1,
    margin: 5,
    maxWidth: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});