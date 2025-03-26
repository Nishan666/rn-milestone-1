import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ChatInterface from '../components/ChatInterface';
import RoomForm from '../components/RoomForm';
import NicknameForm from '../components/NicknameForm';
import { useHomeViewModel } from '../viewModels/useHomeViewModel';

const HomeScreen: React.FC = () => {
  const { profileData, roomData, loading } = useHomeViewModel();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profileData?.nickname === '' ? (
        <NicknameForm />
      ) : roomData === null ? (
        <RoomForm />
      ) : (
        <ChatInterface />
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
