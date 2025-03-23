import React from 'react';
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
import { useNicknameViewModel } from '../viewModels/useNicknameViewModel';

const NicknameForm: React.FC = () => {
  const { handleSubmit, errors, nickname, setNickname, setErrors } = useNicknameViewModel();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please create your profile to continue</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={[styles.input, errors.nickname ? styles.inputError : null]}
            value={nickname}
            onChangeText={text => {
              setNickname(text);
              if (errors.nickname) setErrors(prev => ({ ...prev, nickname: undefined }));
            }}
            placeholder="Enter your nickname"
          />
          {errors.nickname && <Text style={styles.error}>{errors.nickname}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
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

export default NicknameForm;
