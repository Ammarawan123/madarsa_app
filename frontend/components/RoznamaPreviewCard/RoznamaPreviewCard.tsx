import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';

interface RoznamaPreviewCardProps {
  title: string;
  badgeText?: string;
  children: React.ReactNode;
}

export function RoznamaPreviewCard({
  title,
  badgeText,
  children,
}: RoznamaPreviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {badgeText ? <Text style={styles.badgeText}>{badgeText}</Text> : <View />}
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.innerBox}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA998',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#2A4438',
    textAlign: 'right',
  },
  badgeText: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '600',
    color: '#3F725F',
  },
  innerBox: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 12,
    padding: 14,
    minHeight: 52,
    justifyContent: 'center',
  },
});
