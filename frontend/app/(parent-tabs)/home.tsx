import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconCircle } from '@/components/IconCircle/IconCircle';
import { useParentDashboard } from '@/hooks/useParentDashboard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

export default function ParentHomeScreen() {
  const router = useRouter();
  const {
    student,
    isSubmittedToday,
    performanceHistory,
    isLoading,
    errorMessage,
  } = useParentDashboard();

  if (isLoading && !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (errorMessage && !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  const handleStartRoznama = () => {
    if (isSubmittedToday || !student?.id) return;
    router.push(`/parent/roznama/${student.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <IconCircle
              iconSource={require('@/assets/icons/bell-icon.png')}
              showDot={true}
            />
            <View style={{ width: 8 }} />
            <IconCircle iconSource={require('@/assets/icons/message-icon.png')} />
          </View>

          <View style={styles.studentHeaderInfo}>
            <Text style={styles.studentName}>{student?.name || '—'}</Text>
            <View style={styles.presentBadge}>
              <Text style={styles.presentBadgeText}>حاضر</Text>
            </View>
          </View>
        </View>

        <View style={styles.greenInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoTextLeft}>
              {student?.gregorianDate || '—'}
            </Text>
            <Text style={styles.infoTextRight}>
              قاری: {student?.qariName || '—'}
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoTextLeft}>
              {student?.hijriDate || '—'}
            </Text>
            <Text style={styles.infoTextRight}>
              جماعت: {student?.className || '—'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>موجودہ پارہ</Text>
            <Text style={styles.statValueCurrent}>
              {toUrduDigits(student?.currentParaNumber ?? 0)} {student?.currentParaName || ''}
            </Text>
          </View>

          <View style={{ width: 12 }} />

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>مکمل شدہ سپارے</Text>
            <Text style={styles.statValueTotal}>
              {toUrduDigits(student?.completedParas ?? 0)}/{toUrduDigits(student?.totalParas ?? 30)}
            </Text>
          </View>
        </View>

        {isSubmittedToday ? (
          <View style={styles.submittedCard}>
            <Ionicons
              name="book-outline"
              size={22}
              color={Colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submittedText}>روزنامہ جمع ہو چکا ہے</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionRoznamaCard}
            onPress={handleStartRoznama}
            activeOpacity={0.8}
          >
            <Ionicons
              name="book-outline"
              size={22}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionRoznamaText}>روزنامہ جمع کریں</Text>
          </TouchableOpacity>
        )}

        <View style={styles.historySectionHeader}>
          <TouchableOpacity style={styles.seeMoreRow} activeOpacity={0.7}>
            <Text style={styles.seeMoreText}>مزید دیکھیں</Text>
            <Ionicons
              name="chevron-back"
              size={16}
              color={Colors.primary}
              style={{ marginTop: 2, marginRight: 2 }}
            />
          </TouchableOpacity>

          <Text style={styles.historySectionTitle}>روزمرہ کارکردگی</Text>
        </View>

        {performanceHistory && performanceHistory.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <TouchableOpacity
              style={styles.viewPerformanceButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.viewPerformanceText}>کارکردگی دیکھیں</Text>
            </TouchableOpacity>

            <Text style={styles.historyDateText}>{item.dateUrdu}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  errorText: { ...Typography.subtitle, color: Colors.error },
  contentContainer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.xs, paddingBottom: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  studentHeaderInfo: { alignItems: 'flex-end' },
  studentName: { ...Typography.title, fontSize: 24, fontWeight: '700', color: '#181815', textAlign: 'right' },
  presentBadge: { backgroundColor: '#3F725F', paddingHorizontal: 14, paddingVertical: 3, borderRadius: 999, marginTop: 4 },
  presentBadgeText: { ...Typography.hint, color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  greenInfoCard: { backgroundColor: '#3F725F', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoTextLeft: { ...Typography.hint, fontSize: 14, color: '#FFFFFF' },
  infoTextRight: { ...Typography.label, fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  infoDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginVertical: 10 },
  statsRow: { flexDirection: 'row', marginBottom: Spacing.md },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#7DA998', padding: 14, alignItems: 'center', justifyContent: 'center' },
  statLabel: { ...Typography.hint, fontSize: 15, color: '#40554D', marginBottom: 6 },
  statValueTotal: { ...Typography.title, fontSize: 28, fontWeight: '700', color: '#181815' },
  statValueCurrent: { ...Typography.title, fontSize: 22, fontWeight: '700', color: '#181815' },
  submittedCard: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#7DA998', borderRadius: 14, paddingVertical: 14, marginBottom: Spacing.lg },
  submittedText: { ...Typography.label, fontSize: 18, fontWeight: '600', color: '#3F725F' },
  actionRoznamaCard: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3F725F', borderRadius: 14, paddingVertical: 14, marginBottom: Spacing.lg },
  actionRoznamaText: { ...Typography.label, fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  historySectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  historySectionTitle: { ...Typography.sectionHeading, fontSize: 20, fontWeight: '700', color: '#181815' },
  seeMoreRow: { flexDirection: 'row', alignItems: 'center' },
  seeMoreText: { ...Typography.hint, fontSize: 14, color: Colors.primary, fontWeight: '600' },
  historyCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#A6C5B8', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDateText: { ...Typography.label, fontSize: 16, fontWeight: '700', color: '#181815', textAlign: 'right' },
  viewPerformanceButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3F725F', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  viewPerformanceText: { ...Typography.hint, fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});