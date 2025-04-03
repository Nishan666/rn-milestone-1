import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Text } from 'react-native';
import { useDrawerContentViewModel } from '../viewModels/useDrawerContentViewModel';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';
import LottieView from 'lottie-react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import baseColors from '../utils/colorSchema';

const DrawerContent = (props : any) => {
  const { theme, t } = useSettingsViewModel();
  const { icon, appName, environment, handleLogout } = useDrawerContentViewModel();
  const isDark = theme === 'dark';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={isDark ? styles.darkScrollView : styles.scrollView}
      >
        <View style={[styles.drawerHeader, isDark && styles.darkDrawerHeader]}>
          <LottieView
            style={styles.logo}
            source={require('../assets/lottie/logo.json')}
            autoPlay
            loop
          />
          <Text style={[styles.appName, isDark && styles.darkText]}>{appName}</Text>
          <View style={styles.envBadge}>
            <Text style={styles.envText}>{t('environment')}: {environment}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            onPress={() => setShowLogoutConfirm(true)} 
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { marginTop: 10, backgroundColor: '#FF9800', marginHorizontal: 20 }]}
          onPress={() => crashlytics().crash()}
        >
          <Text style={styles.logoutText}>
            Test Crashlytics
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmationContainer, isDark && styles.darkConfirmationContainer]}>
            <Text style={[styles.confirmationTitle, isDark && styles.darkText]}>
              {t('confirmLogout')}
            </Text>
            <Text style={[styles.confirmationMessage, isDark && styles.darkText]}>
              {t('logoutMessage')}
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelButton]} 
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.confirmationButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]} 
                onPress={confirmLogout}
              >
                <Text style={styles.confirmationButtonText}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  darkScrollView: {
    backgroundColor: '#121212',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor:  baseColors.grey100,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
    alignItems: 'center',
  },
  darkDrawerHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  envBadge: {
    backgroundColor:  baseColors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  envText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#fff',
  },
  logoutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  darkConfirmationContainer: {
    backgroundColor: '#1e1e1e',
  },
  confirmationTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  confirmationMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#d32f2f',
  },
  confirmationButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#fff',
  },
});

export default DrawerContent;