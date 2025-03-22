import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface ProfileDetails {
  nickname?: string;
  email?: string;
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedData = await AsyncStorage.getItem('profileData');
        if (storedData) {
          setProfile(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = async () => {
    try {
      await AsyncStorage.removeItem('profileData');
      (navigation as any).navigate('HomeStack');
    } catch (error) {
      console.error('Failed to rename:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.text}>This is your user profile screen.</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nickname</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.value}>{profile?.nickname}</Text>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text>{profile?.nickname ? 'Edit' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10
  },
});

export default ProfileScreen;
