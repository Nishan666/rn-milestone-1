import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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
    fetchRooms, // Assume this function exists in your viewModel to fetch rooms
  } = useRoomViewModel();

  const { theme, t } = useSettingsViewModel();
  const isDarkMode = theme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(existingRooms);

  // Handle search with frontend filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRooms(existingRooms);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = existingRooms.filter(room => room.name.toLowerCase().includes(query));
      setFilteredRooms(filtered);
    }
  }, [searchQuery, existingRooms]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  const renderRoomItem = ({ item }: any) => (
    <Pressable
      key={item.id}
      style={[
        styles.roomItem,
        isDarkMode && styles.roomItemDark,
        selectedRoomId === item.id
          ? isDarkMode
            ? styles.selectedRoomItemDark
            : styles.selectedRoomItem
          : null,
      ]}
      onPress={() => setSelectedRoomId(item.id)}>
      <Text
        style={
          selectedRoomId === item.id
            ? styles.selectedRoomItemText
            : [styles.roomItemText, isDarkMode && styles.roomItemTextDark]
        }>
        {item.name}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode ? themeStyles.dark : themeStyles.light]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#007bff'} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.scrollContainer}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{t('welcome')}</Text>
        <View style={styles.roomOptions}>
          <Pressable
            style={[
              styles.option,
              isDarkMode && styles.optionDark,
              createNewRoom
                ? isDarkMode
                  ? styles.selectedOptionDark
                  : styles.selectedOption
                : null,
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
              !createNewRoom
                ? isDarkMode
                  ? styles.selectedOptionDark
                  : styles.selectedOption
                : null,
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
                errors.room ? styles.inputError : null,
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

            {/* Search input for existing rooms */}
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark, styles.searchInput]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchRooms')}
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            />

            {loading ? (
              <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
                {t('loadingRooms')}...
              </Text>
            ) : existingRooms.length > 0 ? (
              <FlatList
                data={filteredRooms}
                renderItem={renderRoomItem}
                keyExtractor={item => item.id.toString()}
                style={styles.roomList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[isDarkMode ? '#4da6ff' : '#007bff']}
                    tintColor={isDarkMode ? '#4da6ff' : '#007bff'}
                  />
                }
                ListEmptyComponent={
                  <Text style={[styles.noRoomsText, isDarkMode && styles.noRoomsTextDark]}>
                    {t('noMatchingRooms')}
                  </Text>
                }
              />
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
      </View>
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
    flex: 1,
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
  searchInput: {
    marginBottom: 8,
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
    height: 250, // Increased height
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
    backgroundColor: '#121212',
  },
});

export default RoomForm;
