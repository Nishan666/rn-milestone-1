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
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

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

  const { theme, t } = useSettingsViewModel();
  const isDarkMode = theme === 'dark';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{t('welcome')}</Text>
        <View style={styles.roomOptions}>
          <Pressable
            style={[
              styles.option, 
              isDarkMode && styles.optionDark,
              createNewRoom ? (isDarkMode ? styles.selectedOptionDark : styles.selectedOption) : null
            ]}
            onPress={() => setCreateNewRoom(true)}>
            <Text 
              style={
                createNewRoom 
                  ? styles.selectedOptionText 
                  : [styles.optionText, isDarkMode && styles.optionTextDark]
              }>
              {t('createNewRoom')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.option,
              isDarkMode && styles.optionDark,
              !createNewRoom ? (isDarkMode ? styles.selectedOptionDark : styles.selectedOption) : null
            ]}
            onPress={() => setCreateNewRoom(false)}>
            <Text 
              style={
                !createNewRoom 
                  ? styles.selectedOptionText 
                  : [styles.optionText, isDarkMode && styles.optionTextDark]
              }>
              {t('joinExistingRoom')}
            </Text>
          </Pressable>
        </View>

        {createNewRoom ? (
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t('roomName')}</Text>
            <TextInput
              style={[
                styles.input, 
                isDarkMode && styles.inputDark, 
                errors.room ? styles.inputError : null
              ]}
              value={roomName}
              onChangeText={text => {
                setRoomName(text);
                if (errors.room) setErrors(prev => ({ ...prev, room: undefined }));
              }}
              placeholder={t('enterRoomName')}
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            />
            {errors.room && <Text style={styles.error}>{errors.room}</Text>}
          </View>
        ) : (
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>{t('selectRoom')}</Text>
            {loading ? (
              <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
                {t('loadingRooms')}...
              </Text>
            ) : existingRooms.length > 0 ? (
              <View style={styles.roomList}>
                {existingRooms.map(room => (
                  <Pressable
                    key={room.id}
                    style={[
                      styles.roomItem,
                      isDarkMode && styles.roomItemDark,
                      selectedRoomId === room.id 
                        ? (isDarkMode ? styles.selectedRoomItemDark : styles.selectedRoomItem) 
                        : null,
                    ]}
                    onPress={() => setSelectedRoomId(room.id)}>
                    <Text
                      style={
                        selectedRoomId === room.id
                          ? styles.selectedRoomItemText
                          : [styles.roomItemText, isDarkMode && styles.roomItemTextDark]
                      }>
                      {room.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={[styles.noRoomsText, isDarkMode && styles.noRoomsTextDark]}>
                {t('noRoomsAvailable')}
              </Text>
            )}
            {errors.room && <Text style={styles.error}>{errors.room}</Text>}
          </View>
        )}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('saveAndContinue')}</Text>
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
  containerDark: {
    backgroundColor: '#121212',
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
    color: '#000',
  },
  titleDark: {
    color: '#fff',
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
    color: '#000',
  },
  labelDark: {
    color: '#eee',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#2a2a2a',
    color: '#eee',
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
  optionDark: {
    borderColor: '#444',
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectedOptionDark: {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  },
  optionText: {
    color: '#333',
  },
  optionTextDark: {
    color: '#ddd',
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
  roomItemDark: {
    borderColor: '#444',
    backgroundColor: '#2a2a2a',
  },
  selectedRoomItem: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectedRoomItemDark: {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  },
  roomItemText: {
    color: '#333',
  },
  roomItemTextDark: {
    color: '#ddd',
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
  loadingTextDark: {
    color: '#aaa',
  },
  noRoomsText: {
    color: '#666',
    textAlign: 'center',
    padding: 12,
  },
  noRoomsTextDark: {
    color: '#aaa',
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