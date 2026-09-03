import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.subtext}>یہ سکرین جلد شامل کی جائے گی</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  text: {
    ...Typography.title,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtext: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
  },
});