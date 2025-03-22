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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUploadScreen() {
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // API endpoint
  const API_URL = 'https://vevl7yryx5oh4ippc7ub3sgjwe0liphz.lambda-url.us-east-1.on.aws/';

  // Function to handle login with token
  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter a valid token');
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
        setUploadStatus('Logged in successfully! You can now upload images.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid token');
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to upload images.');
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
      setUploadStatus('Image selected. Ready to upload.');
    }
  };

  // Function to get a presigned URL and upload the image
  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsLoading(true);
    setUploadStatus('Getting presigned URL...');

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
        throw new Error(data.error || 'Failed to get presigned URL');
      }

      const presignedUrl: string = data.presignedUrl;
      setUploadStatus('Uploading image to S3...');

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
        setUploadStatus('Image uploaded successfully!');
        const imageUrl = presignedUrl.split('?')[0];
        Alert.alert('Success', `Image uploaded successfully!\nFilename: ${data.filename}`);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error: any) {
      setUploadStatus(`Error: ${error.message}`);
      Alert.alert('Upload Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>S3 Image Uploader</Text>
      
      {!isAuthenticated ? (
        <View style={styles.authContainer}>
          <Text style={styles.label}>Enter your Bearer Token:</Text>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder="Paste your bearer token here"
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} disabled={isLoading} />
          {isLoading && <ActivityIndicator style={styles.loader} size="small" color="#0000ff" />}
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          
          <View style={styles.buttonContainer}>
            <Button title="Pick an Image" onPress={pickImage} disabled={isLoading} />
            <Button 
              title="Upload Image" 
              onPress={uploadImage} 
              disabled={isLoading || !image} 
            />
          </View>
          
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <Text style={styles.status}>{uploadStatus}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  authContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
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
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 10,
  },
  uploadContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
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
  },
  status: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
  },
});

