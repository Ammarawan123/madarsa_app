import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, QuickActionLayout } from '@/constants/theme';

interface QuickActionButtonProps {
  label: string;
  iconSource: any;
  onPress: () => void;
}

export function QuickActionButton({ label, iconSource, onPress }: QuickActionButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Image source={iconSource} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
      <Image
        source={require('@/assets/icons/chevron-left-white.png')}
        style={styles.chevron}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: QuickActionLayout.boxHeight,
    backgroundColor: Colors.primary,
    borderRadius: QuickActionLayout.boxRadius,
    borderWidth: QuickActionLayout.boxBorderWidth,
    borderColor: Colors.primary,
    paddingHorizontal: QuickActionLayout.boxPadding,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    width: QuickActionLayout.iconSize,
    height: QuickActionLayout.iconSize,
  },
  label: {
    ...Typography.quickActionText,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'right',
    marginHorizontal: Spacing.sm,
  },
  chevron: {
    width: QuickActionLayout.chevronSize,
    height: QuickActionLayout.chevronSize,
  },
});