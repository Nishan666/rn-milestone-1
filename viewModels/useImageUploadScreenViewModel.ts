import { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useSettingsViewModel } from "./useSettingsViewModel";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'uploadedImages';

export const useImageUploadScreenViewModel = () => {
    const [token, setToken] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const { theme, t } = useSettingsViewModel();

    // API endpoint
    const API_URL = 'https://vevl7yryx5oh4ippc7ub3sgjwe0liphz.lambda-url.us-east-1.on.aws/';

    // Load previously uploaded images from AsyncStorage
    useEffect(() => {
        const loadUploadedImages = async () => {
            try {
                const savedImages = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedImages) {
                    setUploadedImages(JSON.parse(savedImages));
                }
            } catch (error) {
                console.error('Failed to load saved images:', error);
            }
        };

        if (isAuthenticated) {
            loadUploadedImages();
        }
    }, [isAuthenticated]);

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
                // Request photo permissions after successful login
                requestPhotoPermission();
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

    // Request photo permission
    const requestPhotoPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t('permissionRequired'),
                    t('photoAccessNeeded'),
                    [
                        { text: t('cancel'), style: 'cancel' },
                        { text: t('settings'), onPress: () => openAppSettings() }
                    ]
                );
                return false;
            }
            return true;
        }
        return true;
    };

    // Open app settings (this is a placeholder - you need to implement platform-specific navigation)
    const openAppSettings = () => {
        // For iOS, you might use Linking.openURL('app-settings:')
        // For Android, you might use IntentLauncher or similar
        console.log('Open app settings to enable photo permissions');
    };

    // Function to handle image picking
    const pickImage = async () => {
        const hasPermission = await requestPhotoPermission();
        
        if (!hasPermission) {
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                setImage(result.assets[0].uri);
                setUploadStatus(t('imageSelected'));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert(t('error'), t('imagePickerError'));
        }
    };

    // Save uploaded image URL to AsyncStorage
    const saveImageUrl = async (imageUrl: string) => {
        try {
            const newImages = [...uploadedImages, imageUrl];
            setUploadedImages(newImages);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
        } catch (error) {
            console.error('Error saving image URL:', error);
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
                // Extract the base URL (without query parameters)
                const imageUrl = presignedUrl.split('?')[0];
                
                // Save the uploaded image URL
                await saveImageUrl(imageUrl);
                
                setUploadStatus(t('uploadSuccess'));
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

    // Function to clear upload history
    const clearUploadHistory = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setUploadedImages([]);
            Alert.alert(t('success'), t('historyCleared'));
        } catch (error) {
            console.error('Error clearing history:', error);
            Alert.alert(t('error'), t('failedToClearHistory'));
        }
    };

    return {
        uploadImage,
        pickImage,
        handleLogin,
        isAuthenticated,
        isLoading,
        image,
        uploadStatus,
        theme,
        t,
        token,
        setToken,
        uploadedImages,
        clearUploadHistory
    };
};