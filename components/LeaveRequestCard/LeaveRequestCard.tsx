import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Colors, Spacing, Radius, Typography, LeaveCardLayout, LeaveDetailLayout, ActionButtonLayout } from '@/constants/theme';

import { LeaveRequest, LeaveStatus } from '@/types/home.types';
import { scale } from '@/utils/scaling';

const STATUS_LABELS: Record<LeaveStatus, { label: string; color: string }> = {
  under_review: { label: 'زیر غور', color: Colors.statusUnderReviewBg },
  approved: { label: 'منظور شدہ', color: '#2E7D32' },
  rejected: { label: 'مسترد شدہ', color: Colors.textSecondary },
};

interface LeaveRequestCardProps {
  request: LeaveRequest;
  isResponding: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function LeaveRequestCard({
  request,
  isResponding,
  onApprove,
  onReject,
}: LeaveRequestCardProps) {
  const statusConfig = STATUS_LABELS[request.status];

  return (
    <Card style={styles.leaveCard}>
      {/* Header: name+type (left) + status (right) */}
      <View style={styles.headerRow}>
        <View style={styles.nameGroup}>
          <Text style={styles.name}>
            <Text style={styles.nameDark}>{request.studentName}</Text>
            <Text style={styles.nameMuted}> — </Text>
            <Text style={styles.nameMuted}>{request.grade}</Text>
          </Text>
          <View style={styles.typePill}>
            <Text style={styles.pillText} numberOfLines={1}>{request.typeLabel}</Text>
          </View>
        </View>

        <View style={[styles.statusPill, { backgroundColor: statusConfig.color }]}>
          <Text style={styles.pillText} numberOfLines={1}>{statusConfig.label}</Text>
        </View>
      </View>

      {/* Reason box */}
      <View style={styles.reasonBox}>
        <Text style={styles.reasonCombined}>
          <Text style={styles.reasonLabelBold}>وجہ: </Text>
          <Text style={styles.reasonText}>{request.reason}</Text>
        </Text>
      </View>

      {/* Duration + time ago */}
      <View style={styles.metaRow}>
        <Text style={styles.durationCombined}>
          <Text style={styles.durationLabel}>مدت: </Text>
          <Text style={styles.durationValue}>{request.durationLabel}</Text>
        </Text>
        <Text style={styles.timeAgoText}>{request.timeAgoLabel}</Text>
      </View>

      {isResponding ? (
        <ActivityIndicator color={Colors.primary} style={styles.spinner} />
      ) : (
        <View style={styles.actions}>
  <Button title="منظور" onPress={onApprove} style={styles.actionButton} />
  <View style={styles.actionSpacer} />
  <Button
    title="مسترد"
    onPress={onReject}
    variant="dangerOutline"
    style={styles.actionButton}
  />
</View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  leaveCard: {
    width: LeaveCardLayout.width,
    minHeight: LeaveCardLayout.minHeight,
    borderRadius: LeaveCardLayout.radius,
    borderWidth: LeaveCardLayout.borderWidth,
    padding: LeaveCardLayout.padding,
    gap: LeaveCardLayout.gap,
  },
  headerRow: {
    flexDirection: 'row-reverse',   // pehle 'row' tha
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexShrink: 1,
  },
  statusPill: {
    minWidth: scale(72),
    borderRadius: LeaveDetailLayout.pillRadius,
    paddingVertical: LeaveDetailLayout.pillPaddingV,
    paddingHorizontal: LeaveDetailLayout.pillPaddingH,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  typePill: {
    minWidth: scale(71),
    backgroundColor: Colors.typeArziBg,
    borderRadius: LeaveDetailLayout.pillRadius,
    paddingVertical: LeaveDetailLayout.pillPaddingV,
    paddingHorizontal: LeaveDetailLayout.pillPaddingH,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  pillText: {
    ...Typography.pillText,
    color: '#FFFFFF',
    flexShrink: 0,
  },
  name: {
    textAlign: 'right',
    flexShrink: 1,
  },
  nameDark: {
    ...Typography.leaveName,
    color: Colors.nameDark,
  },
  nameMuted: {
    ...Typography.leaveName,
    color: Colors.nameMuted,
  },
  reasonBox: {
    backgroundColor: Colors.reasonBoxBg,
    borderRadius: LeaveDetailLayout.reasonBoxRadius,
    borderWidth: LeaveDetailLayout.reasonBoxBorderWidth,
    borderColor: Colors.primary,
    padding: LeaveDetailLayout.reasonBoxPadding,
  },
  reasonCombined: {
    textAlign: 'right',
  },
  reasonLabelBold: {
    ...Typography.reasonLabelBold,
    color: Colors.reasonTextColor,
  },
  reasonText: {
    ...Typography.reasonText,
    color: Colors.reasonTextColor,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationCombined: {
    textAlign: 'right',
  },
  durationLabel: {
    ...Typography.durationLabel,
    color: Colors.durationTextColor,
  },
  durationValue: {
    ...Typography.durationValue,
    color: Colors.durationTextColor,
  },
  timeAgoText: {
    ...Typography.timeAgoText,
    color: Colors.timeAgoColor,
  },
  actions: {
    flexDirection: 'row',
  },
  actionSpacer: {
    width: Spacing.sm,
  },
  spinner: {
    marginTop: Spacing.sm,
  },
    actionButton: {
    width: ActionButtonLayout.width,
    height: ActionButtonLayout.height,
    borderRadius: ActionButtonLayout.radius,
    paddingVertical: ActionButtonLayout.paddingV,
  },
});