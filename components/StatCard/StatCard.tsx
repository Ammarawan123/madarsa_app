import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

export function StatCard({ label, value, valueColor }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.hint,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.title,
    color: Colors.textPrimary,
  },
});