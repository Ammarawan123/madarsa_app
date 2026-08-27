import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ title, onPress, isLoading = false, disabled = false }: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.surface} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  text: {
    ...Typography.button,
    color: Colors.surface,
  },
});