import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRoomViewModel } from '../viewModels/useRoomViewModel';

const RoomForm: React.FC = () => {
  const {
    createNewRoom,
    setCreateNewRoom,
    errors,
    roomName,
    setRoomName,
    setErrors,
    loading,
    existingRooms,
    selectedRoomId,
    setSelectedRoomId,
    handleSubmit,
  } = useRoomViewModel();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.roomOptions}>
          <Pressable
            style={[styles.option, createNewRoom ? styles.selectedOption : null]}
            onPress={() => setCreateNewRoom(true)}>
            <Text style={createNewRoom ? styles.selectedOptionText : styles.optionText}>
              Create New Room
            </Text>
          </Pressable>

          <Pressable
            style={[styles.option, !createNewRoom ? styles.selectedOption : null]}
            onPress={() => setCreateNewRoom(false)}>
            <Text style={!createNewRoom ? styles.selectedOptionText : styles.optionText}>
              Join Existing Room
            </Text>
          </Pressable>
        </View>

        {createNewRoom ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Room Name</Text>
            <TextInput
              style={[styles.input, errors.room ? styles.inputError : null]}
              value={roomName}
              onChangeText={text => {
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
                {existingRooms.map(room => (
                  <Pressable
                    key={room.id}
                    style={[
                      styles.roomItem,
                      selectedRoomId === room.id ? styles.selectedRoomItem : null,
                    ]}
                    onPress={() => setSelectedRoomId(room.id)}>
                    <Text
                      style={
                        selectedRoomId === room.id
                          ? styles.selectedRoomItemText
                          : styles.roomItemText
                      }>
                      {room.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.noRoomsText}>No rooms available. Create one instead!</Text>
            )}
            {errors.room && <Text style={styles.error}>{errors.room}</Text>}
          </View>
        )}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </Pressable>
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
