import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FirebaseService } from "../services/FirebaseService";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../store/slices/authSlice";

export const useSignupScreenViewModel = () => {
const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const firebaseService = FirebaseService.getInstance();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await firebaseService.signUp(email, password);
      
      await AsyncStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
      }));

      dispatch(setUser({
        uid: user.uid,
        email: user.email!,
      }));
      const token = await firebaseService.requestFCMToken();
      console.log('FCM Token:', token);
      (navigation as any).navigate('HomeStack');
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignup,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    navigation,
    firebaseService,
    dispatch
  };
};
