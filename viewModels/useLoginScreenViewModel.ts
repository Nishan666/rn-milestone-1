import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FirebaseService } from "../services/FirebaseService";
import { setUser } from "../store/slices/authSlice";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLoginScreenViewModel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const firebaseService = FirebaseService.getInstance();
  
    const handleGoogleSignIn = async () => {
      setLoading(true);
      try {
        const user = await firebaseService.signInWithGoogle();
  
        // Dispatch user to Redux store
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
          }),
        );
        const token = await firebaseService.requestFCMToken();
        console.log('FCM Token:', token);
        (navigation as any).navigate('HomeStack');
      } catch (error: any) {
        Alert.alert('Google Sign-In Error', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Error', 'All fields are required');
        return;
      }
  
      setLoading(true);
      try {
        const user = await firebaseService.login(email, password);
  
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            uid: user.uid,
            email: user.email,
          }),
        );
  
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email!,
          }),
        );
        const token = await firebaseService.requestFCMToken();
        console.log('FCM Token:', token);
        (navigation as any).navigate('HomeStack');
      } catch (error: any) {
        Alert.alert('Login Error', error.message);
      } finally {
        setLoading(false);
      }
    };

  return {
    handleGoogleSignIn,
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    navigation,
    firebaseService,
    dispatch
  };
};
