import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useChatViewModel } from '../viewModels/useChatViewModel';
import { Message } from '../models/types';
import ConfirmationModal from './ConfirmationModal';

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
        {!isCurrentUser && !isSystemMessage && <Text style={styles.userName}>{item.userName}</Text>}
        <View
          style={[
            styles.messageBubble,
            isSystemMessage
              ? styles.systemBubble
              : isCurrentUser
                ? styles.rightBubble
                : styles.leftBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isSystemMessage
                ? styles.systemMessageText
                : isCurrentUser
                  ? styles.rightMessageText
                  : styles.leftMessageText,
            ]}>
            {item.text}
          </Text>
        </View>
        {!isSystemMessage && (
          <Text style={styles.timestamp}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{roomData?.roomName}</Text>
        <Text style={styles.welcomeText}>Logged in as: {profileData?.nickname}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleExitPress}>
          <Text style={styles.logoutText}>Exit Room</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading messages...</Text>
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' || sendLoading ? styles.sendButtonDisabled : null,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === '' || sendLoading}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <ConfirmationModal
          visible={isExitModalVisible}
          title="Exit Room"
          message="Are you sure you want to exit this room?"
          confirmText="Exit"
          cancelText="Cancel"
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
  rightBubble: {
    backgroundColor: '#007bff',
  },
  systemBubble: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  leftMessageText: {
    color: '#000',
  },
  rightMessageText: {
    color: '#fff',
  },
  systemMessageText: {
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
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
