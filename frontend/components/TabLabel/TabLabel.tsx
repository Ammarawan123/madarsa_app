import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

interface TabLabelProps {
  label: string;
  focused: boolean;
}

export function TabLabel({ label, focused }: TabLabelProps) {
  return (
    <Text style={focused ? styles.active : styles.inactive}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  active: {
    ...Typography.tabLabelActive,
    color: Colors.primary,
  },
  inactive: {
    ...Typography.tabLabelInactive,
    color: Colors.tabInactive,
  },
});