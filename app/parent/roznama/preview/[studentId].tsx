import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActionHeader } from '@/components/ActionHeader/ActionHeader';
import { BadgeTag } from '@/components/BadgeTag/BadgeTag';
import { Button } from '@/components/Button/Button';
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal';
import { useParentRoznamaForm } from '@/hooks/useParentRoznamaForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

export default function ParentRoznamaPreviewScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const {
    student,
    homeArrivalTime,
    prayers,
    screenTime,
    parentRemarks,
    isLoading,
    isSubmitting,
    errorMessage,
    submit,
  } = useParentRoznamaForm(studentId || 'std-1');

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // Early return — Loading
  if (isLoading && !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Early return — Error
  if (errorMessage && !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  const handleConfirmSubmit = async () => {
    const success = await submit();
    setConfirmModalVisible(false);

    if (success) {
      // Replace the entire navigation stack to parent dashboard
      router.replace('/(parent-tabs)/home' as never);
    }
  };

  const namazList: { key: keyof typeof prayers; label: string }[] = [
    { key: 'fajr', label: 'فجر' },
    { key: 'asr', label: 'عصر' },
    { key: 'maghrib', label: 'مغرب' },
    { key: 'isha', label: 'عشاء' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ActionHeader title="روزنامہ" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Student Header matching Image 2 */}
        <View style={styles.studentCard}>
          <View style={styles.badgeCol}>
            <BadgeTag status="pending" />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.studentName}>
              {student?.name || 'عبداللہ احمد'}
            </Text>
            <Text style={styles.rollNumber}>
              رول نمبر: {toUrduDigits(student?.rollNumber || '۱۲')}
            </Text>
          </View>
        </View>

        {/* Card 2: گھر پہنچنے کا وقت */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxText}>{homeArrivalTime}</Text>
            </View>
            <Text style={styles.cardHeading}>گھر پہنچنے کا وقت</Text>
          </View>
        </View>

        {/* Card 3: نماز */}
        <View style={styles.card}>
          <Text style={styles.cardHeadingTitle}>نماز</Text>
          <View style={styles.divider} />

          {namazList.map((item, idx) => (
            <View key={item.key}>
              <View style={styles.rowBetween}>
                <Text
                  style={[
                    styles.prayerStatusText,
                    prayers[item.key]
                      ? styles.prayerStatusYes
                      : styles.prayerStatusNo,
                  ]}
                >
                  {prayers[item.key] ? 'ہاں' : 'نہیں'}
                </Text>
                <Text style={styles.prayerLabel}>{item.label}</Text>
              </View>
              {idx < namazList.length - 1 && (
                <View style={styles.thinDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Card 4: اسکرین کا دورانیہ */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxText}>
                {toUrduDigits(String(screenTime.hours).padStart(2, '0'))} گھنٹے : {toUrduDigits(String(screenTime.minutes).padStart(2, '0'))} منٹ
              </Text>
            </View>
            <Text style={styles.cardHeading}>اسکرین کا دورانیہ</Text>
          </View>
        </View>

        {/* Card 5: والدین کی رائے */}
        <View style={styles.card}>
          <Text style={styles.cardHeadingTitle}>والدین کی رائے</Text>
          <View style={styles.divider} />
          <Text style={styles.remarksText}>{parentRemarks}</Text>
        </View>
      </ScrollView>

      {/* Action Buttons matching Image 2 */}
      <View style={styles.bottomBar}>
        <View style={styles.buttonsRow}>
          <Button
            title="جمع کریں"
            onPress={() => setConfirmModalVisible(true)}
            disabled={isSubmitting}
            style={styles.halfButton}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="واپس کریں"
            onPress={() => router.back()}
            variant="outline"
            disabled={isSubmitting}
            style={styles.halfButton}
          />
        </View>
      </View>

      {/* Confirmation Modal matching Image 1 */}
      <ConfirmationModal
        visible={confirmModalVisible}
        title="کیا آپ روزنامہ جمع کرنا چاہتے ہیں؟"
        confirmText="جمع کریں"
        cancelText="واپس کریں"
        isLoading={isSubmitting}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.subtitle,
    color: Colors.error,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 90,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA998',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCol: {
    alignItems: 'flex-start',
  },
  infoCol: {
    alignItems: 'flex-end',
  },
  studentName: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 4,
  },
  rollNumber: {
    ...Typography.hint,
    fontSize: 14,
    color: '#6B7A6E',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA998',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeading: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
  },
  cardHeadingTitle: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF4F0',
    marginBottom: 8,
  },
  thinDivider: {
    height: 1,
    backgroundColor: '#F0F5F2',
    marginVertical: 4,
  },
  valueBox: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  valueBoxText: {
    ...Typography.label,
    fontSize: 15,
    color: '#3F725F',
    fontWeight: '600',
  },
  prayerLabel: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
    paddingVertical: 6,
  },
  prayerStatusText: {
    ...Typography.hint,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 6,
  },
  prayerStatusYes: {
    color: '#3F725F',
  },
  prayerStatusNo: {
    color: '#D92626',
  },
  remarksText: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
    lineHeight: 26,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: 8,
    backgroundColor: Colors.background,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
  },
  buttonSpacer: {
    width: 12,
  },
});
