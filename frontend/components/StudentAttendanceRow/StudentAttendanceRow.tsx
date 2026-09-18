import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@/components/Card/Card';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { StudentAttendanceItem, MarkStatus } from '@/types/attendance-marking.types';

interface StudentAttendanceRowProps {
  student: StudentAttendanceItem;
  onChangeStatus: (status: MarkStatus) => void;
}

export function StudentAttendanceRow({ student, onChangeStatus }: StudentAttendanceRowProps) {
  const isPresent = student.status === 'present';
  const isAbsent = student.status === 'absent';

  return (
    <Card>
      <Text style={styles.name}>
        {student.name} — {student.grade}
      </Text>
      <Text style={styles.rollNumber}>رول نمبر: {student.rollNumber}</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.statusButton, isAbsent && styles.absentActive]}
          onPress={() => onChangeStatus('absent')}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, isAbsent && styles.absentActiveText]}>غیر حاضر</Text>
        </TouchableOpacity>

        <View style={styles.buttonSpacer} />

        <TouchableOpacity
          style={[styles.statusButton, isPresent && styles.presentActive]}
          onPress={() => onChangeStatus('present')}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, isPresent && styles.presentActiveText]}>حاضر</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    ...Typography.label,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  rollNumber: {
    ...Typography.hint,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: Spacing.sm,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.hint,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  absentActive: {
    backgroundColor: `${Colors.error}15`,
    borderColor: Colors.error,
  },
  absentActiveText: {
    color: Colors.error,
  },
  presentActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presentActiveText: {
    color: Colors.surface,
  },
});