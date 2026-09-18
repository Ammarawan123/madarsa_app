import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ManzilEntry } from '@/types/roznama.types';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

interface ManzilCardProps {
  manzil: ManzilEntry;
  index: number;
  onEdit: (manzil: ManzilEntry) => void;
  onDelete: (manzilId: string) => void;
  readOnly?: boolean;
}

export function ManzilCard({
  manzil,
  index,
  onEdit,
  onDelete,
  readOnly = false,
}: ManzilCardProps) {
  const listenerDisplay =
    manzil.recitedTo === 'student'
      ? manzil.listenerStudentName || 'طالب علم'
      : 'قاری صاحب';

  return (
    <View style={styles.card}>
      {/* Top Header Row matching Image 2 */}
      <View style={styles.headerRow}>
        {!readOnly && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => onDelete(manzil.id)}
              style={styles.actionIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity
              onPress={() => onEdit(manzil)}
              style={styles.actionIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={18} color="#C49746" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.titleText}>
          منزل {toUrduDigits(index + 1)} : {manzil.paraName} ({toUrduDigits(manzil.paraNumber)})
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Row: کتنا سنایا */}
      <View style={styles.dataRow}>
        <Text style={styles.dataValue}>{manzil.portion}</Text>
        <Text style={styles.dataLabel}>کتنا سنایا :</Text>
      </View>

      {/* Row: غلطیاں */}
      <View style={styles.dataRow}>
        <Text style={styles.dataValue}>{toUrduDigits(manzil.mistakes)}</Text>
        <Text style={styles.dataLabel}>غلطیاں :</Text>
      </View>

      {/* Row: کس نے سنا */}
      <View style={styles.dataRow}>
        <Text style={styles.dataValue}>{listenerDisplay}</Text>
        <Text style={styles.dataLabel}>کس نے سنا :</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    padding: 2,
  },
  titleText: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDE8E2',
    marginVertical: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  dataLabel: {
    ...Typography.label,
    fontSize: 15,
    color: '#181815',
  },
  dataValue: {
    ...Typography.hint,
    fontSize: 15,
    color: '#3F725F',
    fontWeight: '600',
  },
});
