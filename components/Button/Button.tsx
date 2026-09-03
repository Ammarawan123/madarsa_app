import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'outline' | 'dangerOutline';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const isDangerOutline = variant === 'dangerOutline';
  const isOutline = variant === 'outline';

  const getIndicatorColor = () => {
    if (isDangerOutline) return Colors.dangerBorder;
    if (isOutline) return Colors.primary;
    return Colors.surface;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDangerOutline && styles.dangerButton,
        isOutline && styles.outlineButton,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getIndicatorColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            isDangerOutline && styles.dangerText,
            isOutline && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3F725F',
  },
  dangerButton: {
    backgroundColor: Colors.dangerBg,
    borderWidth: 0.8,
    borderColor: Colors.dangerBorder,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  text: {
    ...Typography.actionButtonText,
    fontSize: 16,
    color: '#FEFEFE',
    fontWeight: '600',
  },
  outlineText: {
    color: '#3F725F',
  },
  dangerText: {
    color: Colors.dangerBorder,
  },
});