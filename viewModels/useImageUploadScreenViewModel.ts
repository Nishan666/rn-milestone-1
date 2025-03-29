import { useState } from "react";
import { Alert } from "react-native";
import { useSettingsViewModel } from "./useSettingsViewModel";
import * as ImagePicker from 'expo-image-picker';


export const useImageUploadScreenViewModel = () => {
    const [token, setToken] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const { theme, t } = useSettingsViewModel();




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
        setIsLoading,
        setIsAuthenticated,
        setImage,
        setUploadStatus
    };
};
