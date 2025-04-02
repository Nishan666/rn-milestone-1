import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { saveRoom } from '../store/slices/roomSlice';
import { FirebaseService, Room } from '../services/FirebaseService';
import { set } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRoomViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector((state: RootState) => state.profile.data);
  const [nickname, setNickname] = useState(profileData?.nickname || '');
  const firebaseService = FirebaseService.getInstance();
  
  useEffect(() => {
    if (profileData?.nickname !== nickname) {
      setNickname(profileData?.nickname || '');
    }
  }, [profileData, nickname]);

  const [roomName, setRoomName] = useState('');
  const [createNewRoom, setCreateNewRoom] = useState(true);
  const [existingRooms, setExistingRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{
    room?: string;
  }>({});

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsList = await firebaseService.fetchRooms();
      
      setExistingRooms(roomsList);
      if (roomsList.length > 0) {
        setSelectedRoomId(roomsList[0].id);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {
      room?: string;
    } = {};
    
    if (createNewRoom && !roomName.trim()) {
      newErrors.room = 'Room name is required';
    } else if (!createNewRoom && !selectedRoomId) {
      newErrors.room = 'Please select a room';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true)
    
    let roomData: Room | undefined;
    
    try {
      if (createNewRoom) {
        if (!roomName.trim()) {
          setErrors(prev => ({ ...prev, room: 'Room name is required' }));
          return;
        }
        
        roomData = await firebaseService.createRoom(roomName, nickname);
      } else {
        roomData = existingRooms.find(room => room.id === selectedRoomId);
      }
      
      if (!roomData) return;
      const token = await AsyncStorage.getItem('fcmToken');
      await firebaseService.saveUserFCMTokenForRoom(roomData.id, profileData?.email || '', profileData?.email || '', token || '');
      
      dispatch(
        saveRoom({
          roomId: roomData.id,
          roomName: roomData.name,
        }),
      );
      
    } catch (error) {
      console.error('Error handling room submission:', error);
      setErrors(prev => ({ ...prev, room: 'Failed to process room' }));
    } finally{
      setLoading(false)
    }
  };
  return {
    createNewRoom,
    setCreateNewRoom,
    roomName,
    setRoomName,
    existingRooms,
    selectedRoomId,
    setSelectedRoomId,
    loading,
    errors,
    handleSubmit,
    setErrors,
    refreshRooms: fetchRooms,
    fetchRooms,
  };
};