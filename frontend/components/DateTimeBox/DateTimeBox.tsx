import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography, CheckInLayout } from '@/constants/theme';

interface DateTimeBoxProps {
  dateLabel: string;
  timeLabel: string;
}

export function DateTimeBox({ dateLabel, timeLabel }: DateTimeBoxProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{dateLabel}</Text>
      <Text style={styles.time}>{timeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: CheckInLayout.dateBoxPaddingV,
    alignItems: 'center',
    gap: CheckInLayout.dateBoxGap,
  },
  date: {
    ...Typography.dateText,
    color: Colors.primary,
  },
  time: {
    ...Typography.timeText,
    color: Colors.textSecondary,
  },
});