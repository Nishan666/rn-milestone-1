import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseService } from '../services/FirebaseService';

const LoginScreen = () => {
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

      navigation.navigate('Home');
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

      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleGoogleSignIn()}
          disabled={loading}>
          <Text>{loading ? 'Signing In...' : 'Continue with Google'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.switchContainer}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#666' },
  switchLink: { color: '#4CAF50', fontWeight: '600' },
});

export default LoginScreen;
