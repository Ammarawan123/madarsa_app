import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card/Card';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { AttendanceHistoryItem } from '@/types/attendance-marking.types';

const BADGE_COLORS: Record<string, string> = {
  leave: '#8A6D1D',
  present: '#2E7D32',
  absent: Colors.error || '#EF4444',
  pending: Colors.textSecondary || '#6B7280',
};

export interface ExtendedAttendanceHistoryItem extends AttendanceHistoryItem {
  monthName?: string; // e.g. "ستمبر 2026"
  dateLabel?: string; // e.g. "23 ستمبر"
}

interface AttendanceHistoryRowProps {
  item: ExtendedAttendanceHistoryItem;
  onPress?: () => void;
}

export function AttendanceHistoryRow({ item, onPress }: AttendanceHistoryRowProps) {
  const badgeTypeKey = String(item.badgeType || 'pending').toLowerCase();
  const badgeColor = BADGE_COLORS[badgeTypeKey] || BADGE_COLORS.pending;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={!onPress}>
      <Card style={styles.cardContainer}>
        {/* Month Header Banner */}
        {item.monthName ? (
          <View style={styles.monthHeader}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.monthText}>{item.monthName}</Text>
          </View>
        ) : null}

        {/* Record Row */}
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={32} color={Colors.textSecondary} />

          <View style={styles.info}>
            <Text style={styles.name}>
              {item.name} {item.grade ? `— ${item.grade}` : ''}
            </Text>
            <Text style={styles.rollNumber}>
              رول نمبر: {item.rollNumber}
              {item.dateLabel ? `  |  📅 ${item.dateLabel}` : ''}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: `${badgeColor}20` }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>
              {item.badgeLabel}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: Spacing.xs,
  },
  monthHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  monthText: {
    ...Typography.hint,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
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