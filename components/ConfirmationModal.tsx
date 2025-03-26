import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { ConfirmationModalProps } from '../models/types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = '#dc3545',
  headerColor = '#007bff',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { backgroundColor: headerColor }]}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalText}>{message}</Text>
          </View>

          <View style={styles.modalFooter}>
            <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalButton,
                styles.confirmButton,
                destructive && { backgroundColor: '#ffebee' },
              ]}
              onPress={onConfirm}>
              <Text style={[styles.confirmButtonText, { color: confirmButtonColor }]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    padding: 15,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    borderRightWidth: 0.5,
    borderRightColor: '#e0e0e0',
  },
  confirmButton: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButtonText: {
    fontWeight: 'bold',
  },
});

export default ConfirmationModal;
