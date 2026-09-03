import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, LoginLayout, Typography } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string | null;
  rightElement?: React.ReactNode;
}

export function Input({ label, errorMessage, rightElement, style, ...rest }: InputProps) {
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, hasError && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.placeholder}
          textAlign="right"
          {...rest}
        />
        {rightElement}
      </View>
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...Typography.fieldLabel,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: LoginLayout.cardBorderWidth,
    borderColor: Colors.border,
    borderRadius: LoginLayout.inputRadius,
    paddingHorizontal: LoginLayout.inputPaddingH,
    height: LoginLayout.inputHeight,
  },
  input: {
    ...Typography.input,
    flex: 1,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.hint,
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    textAlign: 'right',
  },
});