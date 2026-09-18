import React, { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconCircle } from '@/components/IconCircle/IconCircle';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { DailyAttendanceEntry } from '@/types/attendance-marking.types';

// ─── Status badge config matching Figma ──────────────────────────────
const STATUS_CONFIG: Record<
  'present' | 'absent' | 'leave',
  { label: string; bg: string; text: string; borderColor?: string }
> = {
  present: {
    label: 'حاضر',
    bg: '#3D6B5A',
    text: '#FFFFFF',
  },
  absent: {
    label: 'غیر حاضر',
    bg: '#FFFFFF',
    text: '#D32F2F',
    borderColor: '#D32F2F',
  },
  leave: {
    label: 'رخصت',
    bg: '#8D8371',
    text: '#FFFFFF',
  },
};

// ─── Single attendance entry row ─────────────────────────────────────
function AttendanceRowCard({ item }: { item: DailyAttendanceEntry }) {
  const config = STATUS_CONFIG[item.status];

  return (
    <View
      style={[
        styles.entryCard,
        item.status === 'absent' && {
          borderColor: '#D32F2F',
          borderWidth: 1.2,
        },
      ]}
    >
      <Text style={styles.entryDate}>{item.dateLabel}</Text>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: config.bg },
          config.borderColor && {
            borderWidth: 1.2,
            borderColor: config.borderColor,
          },
        ]}
      >
        <Text style={[styles.statusBadgeText, { color: config.text }]}>
          {config.label}
        </Text>
      </View>
    </View>
  );
}

// ─── Empty state component ───────────────────────────────────────────
function EmptyAttendanceState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="document-text-outline" size={40} color="#8D8371" />
      </View>
      <Text style={styles.emptyText}>کوئی سابقہ حاضری موجود نہیں۔</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────
export default function ParentAttendanceTab() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<DailyAttendanceEntry[]>([]);
  const [studentName] = useState('عبداللہ احمد');
  const [grade] = useState('حفظ');
  const [rollNo] = useState('۱۴');
  const [monthLabel] = useState('جون ۲۰۲۶');
  const [monthDisplay] = useState('جون');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const detail = await attendanceService.getStudentHistoryDetail('std-1');
      setEntries(detail.entries);
    } catch {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header Row ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <IconCircle
            iconSource={require('@/assets/icons/bell-icon.png')}
            showDot={true}
          />
          <View style={{ width: 8 }} />
          <IconCircle iconSource={require('@/assets/icons/message-icon.png')} />
        </View>

        <Text style={styles.headerTitle}>سابقہ حاضری</Text>
      </View>

      {/* ── Student Info Card (green) ──────────────────────────── */}
      <View style={styles.contentArea}>
        <View style={styles.studentCard}>
          <View style={styles.studentCardRow}>
            <View style={styles.studentCardLeft}>
              <Text style={styles.studentInfoLabel}>
                درجہ: {grade}
              </Text>
              <Text style={styles.studentInfoLabel}>
                مہینہ: {monthDisplay}
              </Text>
            </View>
            <View style={styles.studentCardRight}>
              <Text style={styles.studentNameText}>{studentName}</Text>
              <Text style={styles.studentRollText}>رول نمبر: {rollNo}</Text>
            </View>
          </View>
        </View>

        {/* ── Month Selector & فہرست Row ──────────────────────── */}
        <View style={styles.monthRow}>
          <Text style={styles.listLabel}>فہرست</Text>
          <View style={styles.monthPill}>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.monthPillText}>{monthLabel}</Text>
          </View>
        </View>

        {/* ── Conditional List / Empty State ──────────────────── */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : entries.length > 0 ? (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AttendanceRowCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyAttendanceState />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 22,
    fontWeight: '700',
    color: '#181815',
  },

  /* Content wrapper */
  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },

  /* Student Info Card */
  studentCard: {
    backgroundColor: '#3F725F',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: Spacing.sm,
  },
  studentCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCardLeft: {
    alignItems: 'flex-start',
  },
  studentCardRight: {
    alignItems: 'flex-end',
  },
  studentNameText: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 4,
  },
  studentRollText: {
    ...Typography.hint,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  studentInfoLabel: {
    ...Typography.hint,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },

  /* Month selector row */
  monthRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  listLabel: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
  },
  monthPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  monthPillText: {
    ...Typography.hint,
    color: Colors.textPrimary,
    marginRight: 4,
  },

  /* Attendance entry card */
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#7DA998',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    ...Typography.label,
    fontSize: 15,
    fontWeight: '600',
    color: '#181815',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    ...Typography.hint,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },

  /* List */
  listContent: {
    paddingBottom: Spacing.xl,
  },

  /* Empty state */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDEAE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    ...Typography.subtitle,
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
  },
});
