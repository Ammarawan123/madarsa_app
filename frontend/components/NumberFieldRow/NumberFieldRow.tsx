import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';

interface NumberFieldRowProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function NumberFieldRow({ label, value, onChangeText }: NumberFieldRowProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        textAlign="center"
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginRight: Spacing.lg, // indent — sub-field lagta hai
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: 4,
    color: Colors.textPrimary,
  },
  label: {
    ...Typography.hint,
    color: Colors.textSecondary,
  },
});