import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card/Card';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { AttendanceHistoryItem } from '@/types/attendance-marking.types';

const BADGE_COLORS: Record<string, string> = {
  leave: '#8A6D1D',
  present: '#2E7D32',
  absent: Colors.error,
  pending: Colors.textSecondary,
};

interface AttendanceHistoryRowProps {
  item: AttendanceHistoryItem;
  onPress: () => void;
}

export function AttendanceHistoryRow({ item, onPress }: AttendanceHistoryRowProps) {
  const badgeColor = BADGE_COLORS[item.badgeType];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={32} color={Colors.textSecondary} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.name} — {item.grade}
            </Text>
            <Text style={styles.rollNumber}>رول نمبر: {item.rollNumber}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${badgeColor}20` }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{item.badgeLabel}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
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
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: {
    ...Typography.hint,
    fontWeight: '600',
  },
});