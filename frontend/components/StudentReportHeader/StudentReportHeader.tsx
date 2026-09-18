import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';
import { ReportStatus } from '@/types/roznama.types';

interface StudentReportHeaderProps {
  studentName: string;
  grade: string;
  rollNumber: string;
  status: ReportStatus;
}

export function StudentReportHeader({
  studentName,
  grade,
  rollNumber,
  status,
}: StudentReportHeaderProps) {
  const isCompleted = status === 'completed';

  return (
    <View style={styles.container}>
      <View style={[styles.statusBadge, isCompleted ? styles.completedBadge : styles.pendingBadge]}>
        <Text style={[styles.statusText, isCompleted && styles.completedText]}>
          {isCompleted ? 'مکمل' : 'باقی ہے'}
        </Text>
      </View>

      <View style={styles.nameBlock}>
        <Text style={styles.name}>
          {studentName} — {grade}
        </Text>
        <Text style={styles.rollNumber}>رول نمبر: {rollNumber}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.lg,
  },
  pendingBadge: {
    backgroundColor: Colors.error,
  },
  completedBadge: {
    backgroundColor: '#DCEFE3',
  },
  statusText: {
    ...Typography.hint,
    color: Colors.surface,
    fontWeight: '600',
  },
  completedText: {
    color: '#2E7D32',
  },
  nameBlock: {
    alignItems: 'flex-end',
  },
  name: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  rollNumber: {
    ...Typography.hint,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});