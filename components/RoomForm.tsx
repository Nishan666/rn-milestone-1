import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RoomData {
  roomId: string;
  roomName: string;
}

interface RoomFormProps {
  onSubmit: (data: RoomData) => void;
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

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const [nickname, setNickname] = useState(""); 

  useEffect(() => {
    const loadNickname = async () => {
      try {
        const data = await AsyncStorage.getItem("profileData");
        if (data) {
          setNickname(JSON.parse(data).nickname);
        }
      } catch (error) {
        console.error("Error retrieving profile data:", error);
      }
    };

    loadNickname();
  }, []);
  
  const [roomName, setRoomName] = useState('');
  const [createNewRoom, setCreateNewRoom] = useState(true);
  const [existingRooms, setExistingRooms] = useState<{ id: string, name: string }[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{
    email?: string;
    room?: string;
  }>({});

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsCollection = collection(db, 'rooms');
      const roomsQuery = query(roomsCollection, orderBy('createdAt', 'desc'));
      const roomsSnapshot = await getDocs(roomsQuery);

      const roomsList = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unnamed Room',
      }));

      setExistingRooms(roomsList);
      if (roomsList.length > 0) {
        setSelectedRoomId(roomsList[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) {
      setErrors(prev => ({ ...prev, room: 'Room name is required' }));
      return null;
    }

    try {
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        createdAt: new Date().toISOString(),
        createdBy: nickname,
      });

      return { id: roomRef.id, name: roomName };
    } catch (error) {
      console.error('Error creating room:', error);
      setErrors(prev => ({ ...prev, room: 'Failed to create room' }));
      return null;
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
    try {
      if (!validateForm()) return;

      let roomData;
      if (createNewRoom) {
        roomData = await createRoom();
        if (!roomData) return;
      } else {
        const selectedRoom = existingRooms.find(room => room.id === selectedRoomId);
        roomData = selectedRoom;
      }

      if (!roomData) return;

      await AsyncStorage.setItem(
        "roomData",
        JSON.stringify({
          roomId: roomData.id,
          roomName: roomData.name,
        })
      );

      onSubmit({
        roomId: roomData.id,
        roomName: roomData.name,
      });
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.roomOptions}>
          <TouchableOpacity
            style={[styles.option, createNewRoom ? styles.selectedOption : null]}
            onPress={() => setCreateNewRoom(true)}
          >
            <Text style={createNewRoom ? styles.selectedOptionText : styles.optionText}>
              Create New Room
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, !createNewRoom ? styles.selectedOption : null]}
            onPress={() => setCreateNewRoom(false)}
          >
            <Text style={!createNewRoom ? styles.selectedOptionText : styles.optionText}>
              Join Existing Room
            </Text>
          </TouchableOpacity>
        </View>

        {createNewRoom ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Room Name</Text>
            <TextInput
              style={[styles.input, errors.room ? styles.inputError : null]}
              value={roomName}
              onChangeText={(text) => {
                setRoomName(text);
                if (errors.room) setErrors(prev => ({ ...prev, room: undefined }));
              }}
              placeholder="Enter room name"
            />
            {errors.room && <Text style={styles.error}>{errors.room}</Text>}
          </View>
        ) : (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Room</Text>
            {loading ? (
              <Text style={styles.loadingText}>Loading rooms...</Text>
            ) : existingRooms.length > 0 ? (
              <View style={styles.roomList}>
                {existingRooms.map((room) => (
                  <TouchableOpacity
                    key={room.id}
                    style={[
                      styles.roomItem,
                      selectedRoomId === room.id ? styles.selectedRoomItem : null,
                    ]}
                    onPress={() => setSelectedRoomId(room.id)}
                  >
                    <Text
                      style={
                        selectedRoomId === room.id
                          ? styles.selectedRoomItemText
                          : styles.roomItemText
                      }
                    >
                      {room.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noRoomsText}>No rooms available. Create one instead!</Text>
            )}
            {errors.room && <Text style={styles.error}>{errors.room}</Text>}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  roomOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  option: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  roomList: {
    maxHeight: 150,
    width: '100%',
  },
  roomItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedRoomItem: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roomItemText: {
    color: '#333',
  },
  selectedRoomItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    padding: 12,
  },
  noRoomsText: {
    color: '#666',
    textAlign: 'center',
    padding: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RoomForm;