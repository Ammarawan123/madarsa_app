import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string | null;
}

export function Input({ label, errorMessage, style, ...rest }: InputProps) {
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.placeholder}
        textAlign="right"
        {...rest}
      />
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'right',
  },
  input: {
    ...Typography.input,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.hint,
    color: Colors.error,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});