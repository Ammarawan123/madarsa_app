import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActionHeader } from '@/components/ActionHeader/ActionHeader';
import { BadgeTag } from '@/components/BadgeTag/BadgeTag';
import { Button } from '@/components/Button/Button';
import { CheckboxRow } from '@/components/CheckboxRow/CheckboxRow';
import { useParentRoznamaForm } from '@/hooks/useParentRoznamaForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

export default function ParentRoznamaEntryScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const {
    student,
    homeArrivalTime,
    prayers,
    screenTime,
    parentRemarks,
    isLoading,
    errorMessage,
    setHomeArrivalTime,
    togglePrayer,
    setScreenTime,
    setParentRemarks,
  } = useParentRoznamaForm(studentId || 'std-1');

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

  const handlePreview = () => {
    router.push(`/parent/roznama/preview/${student?.id || 'std-1'}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ActionHeader title="روزنامہ" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Card 1: Student Header matching Image 3 */}
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

          {/* Card 2: گھر پہنچنے کا وقت matching Image 3 */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.timeBox}>
                <TextInput
                  style={styles.timeInput}
                  value={homeArrivalTime}
                  onChangeText={setHomeArrivalTime}
                  placeholder="۰۰ : ۰۰ شام"
                  placeholderTextColor="#9E9E9E"
                  textAlign="center"
                />
              </View>

              <Text style={styles.cardHeading}>گھر پہنچنے کا وقت</Text>
            </View>
          </View>

          {/* Card 3: نماز (Fajr, Asr, Maghrib, Isha Checkboxes) matching Image 3 */}
          <View style={styles.card}>
            <Text style={styles.cardHeadingTitle}>نماز</Text>
            <View style={styles.divider} />

            <CheckboxRow
              label="فجر"
              checked={prayers.fajr}
              onToggle={() => togglePrayer('fajr')}
            />
            <CheckboxRow
              label="عصر"
              checked={prayers.asr}
              onToggle={() => togglePrayer('asr')}
            />
            <CheckboxRow
              label="مغرب"
              checked={prayers.maghrib}
              onToggle={() => togglePrayer('maghrib')}
            />
            <CheckboxRow
              label="عشاء"
              checked={prayers.isha}
              onToggle={() => togglePrayer('isha')}
              showDivider={false}
            />
          </View>

          {/* Card 4: اسکرین کا دورانیہ matching Image 3 */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.durationBox}>
                <TextInput
                  style={styles.durationInput}
                  value={`${toUrduDigits(
                    String(screenTime.hours).padStart(2, '0')
                  )} گھنٹے : ${toUrduDigits(
                    String(screenTime.minutes).padStart(2, '0')
                  )} منٹ`}
                  onChangeText={(text) => {
                    // Extract numbers if edited
                    const digits = text.match(/\d+/g);
                    if (digits && digits.length >= 2) {
                      setScreenTime(Number(digits[0]), Number(digits[1]));
                    }
                  }}
                  placeholder="۰۰ منٹ : ۰۰ گھنٹے"
                  placeholderTextColor="#9E9E9E"
                  textAlign="center"
                />
              </View>

              <Text style={styles.cardHeading}>اسکرین کا دورانیہ</Text>
            </View>
          </View>

          {/* Card 5: والدین کی رائے matching Image 3 */}
          <View style={styles.card}>
            <Text style={styles.cardHeadingTitle}>والدین کی رائے</Text>
            <View style={styles.divider} />

            <TextInput
              style={styles.remarksInput}
              value={parentRemarks}
              onChangeText={setParentRemarks}
              placeholder="رائے / مشورہ لکھیں......"
              placeholderTextColor="#9E9E9E"
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button matching Image 3 */}
      <View style={styles.bottomBar}>
        <Button
          title="پیش نظر دیکھیں"
          onPress={handlePreview}
          style={styles.previewButton}
        />
      </View>
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
    textAlign: 'right',
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
  timeBox: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 120,
  },
  timeInput: {
    ...Typography.label,
    fontSize: 15,
    color: '#3F725F',
    fontWeight: '600',
  },
  durationBox: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 150,
  },
  durationInput: {
    ...Typography.label,
    fontSize: 15,
    color: '#3F725F',
    fontWeight: '600',
  },
  remarksInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 12,
    minHeight: 100,
    padding: 12,
    fontSize: 16,
    color: '#181815',
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
  previewButton: {
    borderRadius: 14,
    paddingVertical: 14,
  },
});
