import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface ActionHeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function ActionHeader({
  title = 'روزنامہ',
  onBackPress,
  rightElement,
}: ActionHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backCircle}
        onPress={handleBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="واپس جائیں"
      >
        <Ionicons name="arrow-back" size={22} color={Colors.primary} />
      </TouchableOpacity>

      {rightElement ? (
        rightElement
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#7DA998',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.title,
    fontSize: 22,
    fontWeight: '700',
    color: '#181815',
  },
});
