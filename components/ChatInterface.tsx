import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useChatViewModel } from '../viewModels/useChatViewModel';
import { Message } from '../models/types';
import ConfirmationModal from './ConfirmationModal';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const ChatInterface: React.FC = () => {
  const {
    flatListRef,
    inputText,
    loading,
    messages,
    sendLoading,
    sendMessage,
    setInputText,
    profileData,
    roomData,
    confirmExit,
    handleExitPress,
    isExitModalVisible,
    cancelExit,
  } = useChatViewModel();

  const { theme, t } = useSettingsViewModel();
  const isDarkMode = theme === 'dark';

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === profileData?.email;
    const isSystemMessage = item.userId === 'system';

    return (
      <View
        style={[
          styles.messageContainer,
          isSystemMessage
            ? styles.systemMessage
            : isCurrentUser
              ? styles.rightMessage
              : styles.leftMessage,
        ]}>
        {!isCurrentUser && !isSystemMessage && (
          <Text style={[styles.userName, isDarkMode && styles.userNameDark]}>
            {item.userName}
          </Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isSystemMessage
              ? isDarkMode ? styles.systemBubbleDark : styles.systemBubble
              : isCurrentUser
                ? styles.rightBubble
                : isDarkMode ? styles.leftBubbleDark : styles.leftBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isSystemMessage
                ? isDarkMode ? styles.systemMessageTextDark : styles.systemMessageText
                : isCurrentUser
                  ? styles.rightMessageText
                  : isDarkMode ? styles.leftMessageTextDark : styles.leftMessageText,
            ]}>
            {item.text}
          </Text>
        </View>
        {!isSystemMessage && (
          <Text style={[styles.timestamp, isDarkMode && styles.timestampDark]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{roomData?.roomName}</Text>
        <Text style={styles.welcomeText}>
          {t('loggedInAs')}: {profileData?.nickname}
        </Text>
        <Pressable style={styles.logoutButton} onPress={handleExitPress}>
          <Text style={styles.logoutText}>{t('exitRoom')}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={[styles.container, isDarkMode && styles.containerDark]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={isDarkMode ? styles.loadingTextDark : styles.loadingText}>
              {t('loadingMessages')}...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id || Math.random().toString()}
            inverted={true}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
          />
        )}

        <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('typeMessage')}
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            multiline
          />
          <Pressable
            style={[
              styles.sendButton,
              inputText.trim() === '' || sendLoading ? styles.sendButtonDisabled : null,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === '' || sendLoading}>
            <Text style={styles.sendButtonText}>{t('send')}</Text>
          </Pressable>
        </View>
        <ConfirmationModal
          visible={isExitModalVisible}
          title={t('exitRoom')}
          message={t('exitRoomConfirmation')}
          confirmText={t('exit')}
          cancelText={t('cancel')}
          confirmButtonColor="#dc3545"
          headerColor="#007bff"
          onConfirm={confirmExit}
          onCancel={cancelExit}
          destructive={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    backgroundColor: '#007bff',
    borderBottomWidth: 1,
    borderBottomColor: '#0056b3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 14,
    color: '#e6e6e6',
    marginTop: 4,
  },
  logoutButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333',
  },
  loadingTextDark: {
    color: '#ddd',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  leftMessage: {
    alignSelf: 'flex-start',
  },
  rightMessage: {
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  userName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
    marginLeft: 10,
  },
  userNameDark: {
    color: '#aaa',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 2,
  },
  leftBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  leftBubbleDark: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
  },
  rightBubble: {
    backgroundColor: '#007bff',
  },
  systemBubble: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  systemBubbleDark: {
    backgroundColor: '#282828',
    borderColor: '#444',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  leftMessageText: {
    color: '#000',
  },
  leftMessageTextDark: {
    color: '#eee',
  },
  rightMessageText: {
    color: '#fff',
  },
  systemMessageText: {
    color: '#666',
    fontStyle: 'italic',
  },
  systemMessageTextDark: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  timestampDark: {
    color: '#aaa',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputContainerDark: {
    borderTopColor: '#444',
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    color: '#000',
  },
  inputDark: {
    borderColor: '#444',
    color: '#eee',
    backgroundColor: '#2a2a2a',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#007bff',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatInterface;
// ADD INDEX
// https://console.firebase.google.com/v1/r/project/chat-app-a56fe/firestore/indexes?create_composite=Ck9wcm9qZWN0cy9jaGF0LWFwcC1hNTZmZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVzc2FnZXMvaW5kZXhlcy9fEAEaCgoGcm9vbUlkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg