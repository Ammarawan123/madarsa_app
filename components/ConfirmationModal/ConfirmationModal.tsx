import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button } from '@/components/Button/Button';
import { Spacing, Typography } from '@/constants/theme';

interface ConfirmationModalProps {
  visible: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title = 'کیا آپ روزنامہ جمع کرنا چاہتے ہیں؟',
  confirmText = 'جمع کریں',
  cancelText = 'واپس کریں',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogCard}>
              <Text style={styles.titleText}>{title}</Text>

              <View style={styles.buttonsRow}>
                <Button
                  title={confirmText}
                  onPress={onConfirm}
                  isLoading={isLoading}
                  style={styles.halfButton}
                />
                <View style={styles.buttonSpacer} />
                <Button
                  title={cancelText}
                  onPress={onCancel}
                  variant="outline"
                  disabled={isLoading}
                  style={styles.halfButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  titleText: {
    ...Typography.title,
    fontSize: 20,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonSpacer: {
    width: 12,
  },
});
