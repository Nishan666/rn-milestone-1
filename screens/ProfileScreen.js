import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.text}>This is your user profile screen.</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>John Doe</Text>
        
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>john.doe@example.com</Text>
        
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Administrator</Text>
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
    marginBottom: 10,
  },
});

export default ProfileScreen;