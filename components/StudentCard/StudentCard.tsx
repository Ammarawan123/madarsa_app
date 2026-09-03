import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BadgeTag } from '@/components/BadgeTag/BadgeTag';
import { Student } from '@/types/roznama.types';
import { Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

export function StudentCard({ student, onPress }: StudentCardProps) {
  const getBorderColor = () => {
    switch (student.status) {
      case 'pending':
        return '#F0A8A8'; // Subtle reddish border matching screenshot 1
      case 'draft':
        return '#D2C4A2'; // Subtle olive border
      case 'completed':
      default:
        return '#A6C5B8'; // Subtle greenish border
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: getBorderColor() }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.badgeContainer}>
        <BadgeTag status={student.status} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{student.name}</Text>
        <Text style={styles.rollText}>
          رول نمبر : {toUrduDigits(student.rollNumber)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nameText: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 2,
  },
  rollText: {
    ...Typography.hint,
    fontSize: 13,
    color: '#6B7A6E',
    textAlign: 'right',
  },
});
