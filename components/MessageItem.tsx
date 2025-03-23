import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageItemProps } from '../models/types';

const MessageItem: React.FC<MessageItemProps> = ({ text, sender, timestamp }) => {
  return (
    <View 
      style={[
        styles.messageBubble, 
        sender === 'user' ? styles.userMessage : styles.systemMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        sender === 'user' ? styles.userMessageText : styles.systemMessageText
      ]}>
        {text}
      </Text>
      <Text style={[
        styles.timestamp,
        sender === 'user' ? styles.userTimestamp : styles.systemTimestamp
      ]}>
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  systemMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  systemMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: '#e0e0e0',
  },
  systemTimestamp: {
    color: '#999',
  },
});

export default MessageItem;