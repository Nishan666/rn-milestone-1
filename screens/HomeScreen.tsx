import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ChatInterface from '../components/ChatInterface';
import RoomForm from '../components/RoomForm';
import NicknameForm from '../components/NicknameForm';
import { useHomeViewModel } from '../viewModels/useHomeViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const HomeScreen: React.FC = () => {
  const { profileData, roomData, loading } = useHomeViewModel();
  const { theme, t } = useSettingsViewModel();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, themeStyles[theme  as 'light' | 'dark']]}>
        <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#007bff'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyles[theme as 'light' | 'dark']]}>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const themeStyles = StyleSheet.create({
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#121212', // Dark theme background
  },
});

export default HomeScreen;