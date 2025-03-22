import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatInterface from '../components/ChatInterface';
import RoomForm from '../components/RoomForm';
import NicknameForm from '../components/NicknameForm';
import { onLog } from 'firebase/app';

interface ProfileData {
  nickname: string;
  email: string;
}

interface RoomData {
  roomId: string;
  roomName: string;
}

const HomeScreen: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [roomData, setRoomData] = useState<RoomData |  null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('profileData');
      if (jsonValue) {
        setProfileData(JSON.parse(jsonValue));
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('roomData');
      setRoomData(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      {profileData === null ? (
        <NicknameForm onSubmit={setProfileData} />
      ) : roomData === null ? (
        <RoomForm onSubmit={setRoomData} />
      ) : (
        <ChatInterface profileData={{ ...profileData, ...roomData }} onLogout={handleLogout} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;