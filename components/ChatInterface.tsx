import React, { useState, useEffect, useRef } from 'react';
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
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';

interface ProfileData {
  nickname: string;
  email: string;
  roomId: string;
  roomName: string;
}

interface Message {
  id?: string;
  text: string;
  createdAt: Date;
  userId: string;
  userName: string;
}

interface ChatInterfaceProps {
  profileData: ProfileData;
  onLogout: () => void;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2WjnyfE7PK8ZTM4_O5ukAeinCNVozFgE",
  authDomain: "chat-app-a56fe.firebaseapp.com",
  projectId: "chat-app-a56fe",
  storageBucket: "chat-app-a56fe.firebasestorage.app",
  messagingSenderId: "110606577185",
  appId: "1:110606577185:web:baddf6664e8f81a2d07d60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profileData, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Current user info
  const currentUser = {
    id: profileData.email,
    name: profileData.nickname
  };

  useEffect(() => {
    // Create a reference to the messages collection
    const messagesRef = collection(db, 'messages');

    // Create a query against the collection to order messages by createdAt and filter by roomId
    const q = query(
      messagesRef, 
      where("roomId", "==", profileData.roomId),
      orderBy('createdAt', 'desc')
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map(doc => {
        const data = doc.data();

        // Handle timestamp that might be null or missing
        let createdAtDate = new Date();
        if (data.createdAt instanceof Timestamp) {
          createdAtDate = data.createdAt.toDate();
        } else if (data.createdAt) {
          // If it's not a Firestore timestamp but exists, try to parse it
          createdAtDate = new Date(data.createdAt);
        }

        return {
          id: doc.id,
          text: data.text || '',
          createdAt: createdAtDate,
          userId: data.userId || 'unknown',
          userName: data.userName || 'Anonymous'
        } as Message;
      });

      setMessages(messagesFirestore);
      setLoading(false);
    }, error => {
      console.error("Error listening to messages: ", error);
      setLoading(false);
    });

    // Add welcome message when chat is first shown if there are no messages
    if (messages.length === 0) {
      // This is just for UI display, not stored in Firebase
      setMessages([{
        id: 'welcome',
        text: `Welcome to the "${profileData.roomName}" room, ${profileData.nickname}!`,
        createdAt: new Date(),
        userId: 'system',
        userName: 'System'
      }]);
    }

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [profileData.roomId]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    setSendLoading(true);
    const inputTextMessage = inputText;
    setInputText('');

    try {
      const now = new Date();

      // Add new message to Firestore
      await addDoc(collection(db, 'messages'), {
        text: inputTextMessage,
        createdAt: serverTimestamp(),
        localCreatedAt: now.toISOString(), // Backup timestamp
        userId: currentUser.id,
        userName: currentUser.name,
        roomId: profileData.roomId
      });

      setSendLoading(false);
    } catch (error) {
      console.error("Error sending message: ", error);
      setSendLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === currentUser.id;
    const isSystemMessage = item.userId === 'system';

    return (
      <View style={[
        styles.messageContainer,
        isSystemMessage ? styles.systemMessage : (isCurrentUser ? styles.rightMessage : styles.leftMessage)
      ]}>
        {!isCurrentUser && !isSystemMessage && (
          <Text style={styles.userName}>{item.userName}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isSystemMessage ? styles.systemBubble : (isCurrentUser ? styles.rightBubble : styles.leftBubble)
        ]}>
          <Text style={[
            styles.messageText,
            isSystemMessage ? styles.systemMessageText : (isCurrentUser ? styles.rightMessageText : styles.leftMessageText)
          ]}>{item.text}</Text>
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
        <Text style={styles.headerTitle}>{profileData.roomName}</Text>
        <Text style={styles.welcomeText}>Logged in as: {profileData.nickname}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
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
              (inputText.trim() === '' || sendLoading) ? styles.sendButtonDisabled : null
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === '' || sendLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
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