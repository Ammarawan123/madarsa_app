import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from '@/components/Input/Input';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';
import { ReciterType } from '@/types/roznama.types';

interface ReciterSelectorProps {
  reciterType: ReciterType;
  reciterStudentName: string | null;
  onChangeReciterType: (type: ReciterType) => void;
  onChangeStudentName: (name: string) => void;
}

export function ReciterSelector({
  reciterType,
  reciterStudentName,
  onChangeReciterType,
  onChangeStudentName,
}: ReciterSelectorProps) {
  return (
    <View>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.option, reciterType === 'student' && styles.optionActive]}
          onPress={() => onChangeReciterType('student')}
          activeOpacity={0.85}
        >
          <Text style={[styles.optionText, reciterType === 'student' && styles.optionTextActive]}>
            طالب علم نے سبق سنایا
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.option, reciterType === 'qari' && styles.optionActive]}
          onPress={() => onChangeReciterType('qari')}
          activeOpacity={0.85}
        >
          <Text style={[styles.optionText, reciterType === 'qari' && styles.optionTextActive]}>
            استاد نے سبق سنایا
          </Text>
        </TouchableOpacity>
      </View>

      {/* Early return jaisa conditional render — sirf student mode mein naam field */}
      {reciterType === 'student' && (
        <Input
          label="طالب علم کا نام"
          placeholder="نام درج کریں"
          value={reciterStudentName ?? ''}
          onChangeText={onChangeStudentName}
          style={styles.nameInput}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row-reverse',
    marginBottom: Spacing.md,
  },
  spacer: {
    width: Spacing.sm,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    ...Typography.hint,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionTextActive: {
    color: Colors.surface,
  },
  nameInput: {
    marginTop: Spacing.sm,
  },
});