import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SegmentedToggle } from '@/components/SegmentedToggle/SegmentedToggle';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { StudentAttendanceRow } from '@/components/StudentAttendanceRow/StudentAttendanceRow';
import { AttendanceHistoryRow } from '@/components/AttendanceHistoryRow/AttendanceHistoryRow';
import { Button } from '@/components/Button/Button';
import { useAttendanceMarking } from '@/hooks/useAttendanceMarking';
import { useAttendanceHistory } from '@/hooks/useAttendanceHistory';
import { Colors, Spacing, Typography } from '@/constants/theme';

type AttendanceMode = 'today' | 'history';

export default function AttendanceScreen() {
  const [mode, setMode] = useState<AttendanceMode>('today');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <SegmentedToggle
          options={[
            { value: 'today', label: 'آج کی حاضری' },
            { value: 'history', label: 'سابقہ حاضری' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </View>

      {/* Early return se yahan simple switch — koi nested if-else nahi */}
      {mode === 'today' ? <TodayAttendanceSection /> : <HistorySection />}
    </SafeAreaView>
  );
}

function TodayAttendanceSection() {
  const {
    students,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSubmitting,
    errorMessage,
    setStudentStatus,
    markAllPresent,
    submit,
  } = useAttendanceMarking();

  const [allPresent, setAllPresent] = useState(false);

  const handleToggleAllPresent = (value: boolean) => {
    setAllPresent(value);
    markAllPresent(value);
  };

  const handleSubmit = async () => {
    await submit();
    // Yahan chahen to success toast/navigation add kar sakte hain
  };

  // Early return — loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Early return — error
  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="طلبہ تلاش کریں"
      />

      <View style={styles.allPresentRow}>
        <Switch
          value={allPresent}
          onValueChange={handleToggleAllPresent}
          trackColor={{ true: Colors.primary }}
        />
        <Text style={styles.allPresentLabel}>سب کو حاضر کریں</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentAttendanceRow
            student={item}
            onChangeStatus={(status) => setStudentStatus(item.id, status)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.submitContainer}>
        <Button title="حاضری جمع کریں" onPress={handleSubmit} isLoading={isSubmitting} />
      </View>
    </View>
  );
}

function HistorySection() {
  const router = useRouter();
  const { list, searchQuery, setSearchQuery, isLoading, errorMessage } = useAttendanceHistory();

  // Early return — loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Early return — error
  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="طلبہ تلاش کریں"
      />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AttendanceHistoryRow
            item={item}
            onPress={() => router.push(`/student-history/${item.id}`)}
          />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
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
  allPresentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  allPresentLabel: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  submitContainer: {
    paddingVertical: Spacing.md,
  },
});