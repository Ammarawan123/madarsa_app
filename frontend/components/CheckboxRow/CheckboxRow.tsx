import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  showDivider?: boolean;
  disabled?: boolean;
}

export function CheckboxRow({
  label,
  checked,
  onToggle,
  showDivider = true,
  disabled = false,
}: CheckboxRowProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => !disabled && onToggle(!checked)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View
          style={[
            styles.checkbox,
            checked ? styles.checkboxChecked : styles.checkboxUnchecked,
          ]}
        >
          {checked && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>

        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7DA998',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF4F0',
  },
});
