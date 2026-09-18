import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RoznamaStatus } from '@/types/roznama.types';
import { Typography } from '@/constants/theme';

interface BadgeTagProps {
  status: RoznamaStatus;
}

export function BadgeTag({ status }: BadgeTagProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'مکمل',
          backgroundColor: '#3F725F',
        };
      case 'draft':
        return {
          label: 'مسودہ',
          backgroundColor: '#A89868',
        };
      case 'pending':
      default:
        return {
          label: 'باقی ہے',
          backgroundColor: '#D92626',
        };
    }
  };

  const { label, backgroundColor } = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  text: {
    ...Typography.hint,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
