import { useState, useEffect, useRef } from 'react';
import { Message } from '../models/types';
import { AppDispatch, RootState } from '../store';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseService } from '../services/FirebaseService';
import { clearRoom } from '../store/slices/roomSlice';

export function useChatViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  const profileData = useSelector((state: RootState) => state.profile.data);
  const roomData = useSelector((state: RootState) => state.room.data);

  const currentUser = {
    id: profileData?.email,
    name: profileData?.nickname,
  };

  useEffect(() => {
    // Make sure we have a roomId before setting up the listener
    if (!roomData?.roomId) {
      setLoading(false);
      return;
    }

    const firebaseService = FirebaseService.getInstance();

    // Set up listener for messages using the Firebase service
    const unsubscribe = firebaseService.listenToMessages(
      roomData.roomId,
      messagesFromFirebase => {
        setMessages(messagesFromFirebase);
        setLoading(false);
      },
      error => {
        console.error('Error listening to messages: ', error);
        setLoading(false);
      },
      true,
      roomData?.roomName,
      profileData?.nickname,
    );

    // Clean up listener when component unmounts or roomId changes
    return () => {
      unsubscribe();
    };
  }, [roomData?.roomId, roomData?.roomName, profileData?.nickname]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    setSendLoading(true);
    const inputTextMessage = inputText;
    setInputText('');

    try {
      if (!currentUser?.id || !currentUser?.name || !roomData?.roomId) {
        throw new Error('User or room data not available');
      }
      FirebaseService.getInstance().sendMessage(
        inputTextMessage,
        currentUser?.id,
        currentUser.name,
        roomData?.roomId,
      );
      setSendLoading(false);
    } catch (error) {
      console.error('Error sending message: ', error);
      setSendLoading(false);
    }
  };

  const exitRoom = () => {
    dispatch(clearRoom());
  };

  const handleExitPress = () => {
    setIsExitModalVisible(true);
  };

  const confirmExit = () => {
    setIsExitModalVisible(false);
    exitRoom();
  };

  const cancelExit = () => {
    setIsExitModalVisible(false);
  };

  return {
    messages,
    inputText,
    setInputText,
    loading,
    sendLoading,
    flatListRef,
    sendMessage,
    profileData,
    roomData,
    handleExitPress,
    isExitModalVisible,
    confirmExit,
    cancelExit,
  };
}
