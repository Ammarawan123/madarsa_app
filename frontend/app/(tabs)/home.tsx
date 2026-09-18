import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconCircle } from '@/components/IconCircle/IconCircle';
import { QuickActionButton } from '@/components/QuickActionButton/QuickActionButton';
import { LeaveRequestCard } from '@/components/LeaveRequestCard/LeaveRequestCard';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';
import { Colors, Spacing, Typography, HomeHeaderLayout } from '@/constants/theme';
import { LeaveRequest } from '@/types/home.types';

const URDU_DIGITS: readonly string[] = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toUrduDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit: string) => URDU_DIGITS[Number(digit)]);
}

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const { data, isLoading, errorMessage, respondingId, respondToLeaveRequest } =
    useHomeDashboard();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (errorMessage || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage ?? 'کوئی ڈیٹا موجود نہیں'}</Text>
      </SafeAreaView>
    );
  }

  const { profile, classSummary, attendanceSummary, leaveRequests } = data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <IconCircle
              iconSource={require('@/assets/icons/bell-icon.png')}
              showDot={profile.hasUnreadNotifications}
            />
            <IconCircle iconSource={require('@/assets/icons/message-icon.png')} />
          </View>
          <View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
          </View>
        </View>

        {/* Date + Class Card */}
        <View style={styles.dateCard}>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{classSummary.gregorianDate}</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.classRow}>
            <Text style={styles.islamicDateText}>{classSummary.hijriDate}</Text>
            <Text style={styles.classPillText}>کلاس: {classSummary.className}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          {/* Attendance Card */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>
              <Text>حاضر</Text>
              <Text style={{ opacity: 1 }}> / </Text>
              <Text>غیر حاضر</Text>
            </Text>
            <Text style={styles.statValueRow} numberOfLines={1}>
              <Text style={styles.presentDigit}>{toUrduDigits(attendanceSummary.presentCount)}</Text>
              <Text style={styles.slashChar}> / </Text>
              <Text style={styles.absentDigit}>{toUrduDigits(attendanceSummary.absentCount)}</Text>
            </Text>
          </View>

          <View style={styles.statsSpacer} />

          {/* Total Students Card */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>کل طلبہ</Text>
            <Text style={styles.statValueTotal}>
              {toUrduDigits(attendanceSummary.totalStudents)}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionHeadingText}>مقررہ کام</Text>
        <QuickActionButton
          label="طلبہ کی حاضری درج کریں"
          iconSource={require('@/assets/icons/quick-action-attendance.png')}
          onPress={() => router.push('/(tabs)/attendance')}
        />
      <QuickActionButton
        label="روزنامہ شروع کریں"
        iconSource={require('@/assets/icons/quick-action-diary.png')}
        onPress={() => router.push('/(tabs)/roznama')}
      />

        {/* Leave Requests */}
        <View style={styles.sectionHeaderRow}>
          <TouchableOpacity style={styles.seeMoreRow}>
            <Image
              source={require('@/assets/icons/chevron-left-outline.png')}
              style={styles.seeMoreIcon}
              resizeMode="contain"
            />
            <Text style={styles.seeMore}>مزید دیکھیں</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>رخصت درخواستیں</Text>
        </View>

        {leaveRequests.map((request: LeaveRequest) => (
          <LeaveRequestCard
            key={request.id}
            request={request}
            isResponding={respondingId === request.id}
            onApprove={() => respondToLeaveRequest(request.id, true)}
            onReject={() => respondToLeaveRequest(request.id, false)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { ...Typography.subtitle, color: Colors.error },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerIcons: { flexDirection: 'row' },
  profileName: { ...Typography.homeName, color: Colors.textPrimary, textAlign: 'right' },
  profileRole: { ...Typography.homeRole, color: Colors.textMuted, textAlign: 'right', marginTop: 2 },

  dateCard: {
    width: HomeHeaderLayout.dateCardWidth,
    minHeight: HomeHeaderLayout.dateCardHeight,
    backgroundColor: Colors.primary,
    borderRadius: HomeHeaderLayout.dateCardRadius,
    paddingTop: HomeHeaderLayout.dateCardPaddingTop,
    paddingRight: HomeHeaderLayout.dateCardPaddingRight,
    paddingBottom: HomeHeaderLayout.dateCardPaddingBottom,
    paddingLeft: HomeHeaderLayout.dateCardPaddingLeft,
    gap: HomeHeaderLayout.dateCardGap,
    marginBottom: Spacing.md,
  },
  dateRow: { flexDirection: 'row-reverse' },
  dateText: { ...Typography.dateBoxDate, color: '#FFFFFF' },
  classRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classPillText: { ...Typography.classPillText, color: '#FFFFFF' },
  islamicDateText: { ...Typography.dateBoxIslamic, color: '#FFFFFF' },

  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#FFFFFF33',
    alignSelf: 'center',
    marginVertical: 8,
  },

  statsRow: { flexDirection: 'row', marginBottom: Spacing.lg },
  statsSpacer: { width: Spacing.sm },
  statBox: {
    flex: 1,
    height: HomeHeaderLayout.statCardHeight,
    backgroundColor: Colors.surface,
    borderRadius: HomeHeaderLayout.statCardRadius,
    borderWidth: HomeHeaderLayout.statCardBorderWidth,
    borderColor: Colors.border,
    padding: HomeHeaderLayout.statCardPadding,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#40554D',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValueTotal: {
    fontSize: 32,
    fontWeight: '400',
    color: '#181815',
    textAlign: 'center',
    lineHeight: 40,
  },
  statValueRow: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 40,
  },
  presentDigit: {
    color: '#D92626',
  },
  slashChar: {
    color: '#676767',
  },
  absentDigit: {
    color: '#3F725F',
  },

  sectionHeadingText: {
    ...Typography.sectionHeading,
    color: Colors.textDark,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
    sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.leaveSectionHeading,
    color: Colors.leaveHeadingColor,
    textAlign: 'right',
  },
  seeMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  seeMore: {
    ...Typography.seeMoreText,
    color: Colors.seeMoreColor,
  },
});