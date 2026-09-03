import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card/Card';
import { StatusTag } from '@/components/StatusTag/StatusTag';
import { useStudentHistory } from '@/hooks/useStudentHistory';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function StudentHistoryScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { detail, isLoading, errorMessage } = useStudentHistory(studentId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>سابقہ حاضری</Text>
      </View>

      <StudentHistoryBody isLoading={isLoading} errorMessage={errorMessage} detail={detail} />
    </SafeAreaView>
  );
}

function StudentHistoryBody({
  isLoading,
  errorMessage,
  detail,
}: ReturnType<typeof useStudentHistory>) {
  // Early return — loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Early return — error ya data na ho
  if (errorMessage || !detail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage ?? 'کوئی ڈیٹا موجود نہیں'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Card style={styles.studentCard}>
        <Text style={styles.studentName}>
          درجہ: {detail.grade} — {detail.studentName}
        </Text>
        <Text style={styles.rollNumber}>رول نمبر: {detail.rollNumber}</Text>
      </Card>

      <View style={styles.monthRow}>
        <Text style={styles.monthLabel}>فہرست</Text>
        <View style={styles.monthPill}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textPrimary} />
          <Text style={styles.monthPillText}>{detail.monthLabel}</Text>
        </View>
      </View>

      <FlatList
        data={detail.entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.entryRow}>
              <Text style={styles.entryDate}>{item.dateLabel}</Text>
              <StatusTag status={item.status} />
            </View>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.subtitle,
    color: Colors.error,
  },
  studentCard: {
    backgroundColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  studentName: {
    ...Typography.label,
    color: Colors.surface,
    textAlign: 'right',
  },
  rollNumber: {
    ...Typography.hint,
    color: Colors.surface,
    textAlign: 'right',
    marginTop: 2,
  },
  monthRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  monthLabel: {
    ...Typography.label,
    color: Colors.textPrimary,
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
  entryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});