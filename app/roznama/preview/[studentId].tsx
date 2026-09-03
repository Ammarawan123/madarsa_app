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
import { RoznamaPreviewCard } from '@/components/RoznamaPreviewCard/RoznamaPreviewCard';
import { useRoznamaForm } from '@/hooks/useRoznamaForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';

export default function RoznamaPreviewScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const {
    student,
    isHifz,
    // Sabaq
    hasSabaq,
    lessonStage,
    boardNumber,
    sabaqFrom,
    sabaqTo,
    // Sabqi
    hasSabqi,
    sabqiMistakes,
    // Hifz
    isParaComplete,
    completedParaNumber,
    hasManzil,
    manzilEntries,
    // Teacher Opinion
    teacherOpinion,
    isLoading,
    errorMessage,
    submit,
  } = useRoznamaForm(studentId || '');

  const [isSaving, setIsSaving] = useState(false);

  // Early return — Loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Early return — Error
  if (errorMessage || !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage ?? 'طالب علم نہیں ملا'}</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    const success = await submit();
    setIsSaving(false);

    if (success) {
      router.replace('/(tabs)/roznama');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ActionHeader title="روزنامہ" onBackPress={handleGoBack} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Student Header matching Image 3 */}
        <View style={styles.studentCard}>
          <View style={styles.badgeCol}>
            <BadgeTag status={student.status} />
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.studentName}>
              {student.name} — {student.className}
            </Text>
            <Text style={styles.rollNumber}>
              رول نمبر : {toUrduDigits(student.rollNumber)}
            </Text>
          </View>
        </View>

        {isHifz ? (
          // Hifz Preview Flow matching Image 3
          <>
            {/* Card 2: پارہ مکمل ہوا */}
            {isParaComplete && (
              <RoznamaPreviewCard title="پارہ مکمل ہوا">
                <View style={styles.keyValueRow}>
                  <Text style={styles.keyValueText}>
                    {completedParaNumber || '۱ الم'}
                  </Text>
                  <Text style={styles.keyLabelText}>پارہ :</Text>
                </View>
              </RoznamaPreviewCard>
            )}

            {/* Card 3: سبق سنایا */}
            <RoznamaPreviewCard
              title="سبق سنایا"
              badgeText={hasSabaq ? 'ہاں' : 'نہیں'}
            >
              {hasSabaq ? (
                <>
                  <View style={styles.keyValueRow}>
                    <Text style={styles.keyValueText}>
                      {sabaqFrom || 'سورۃ البقرہ، آیت ۵'}
                    </Text>
                    <Text style={styles.keyLabelText}>کہاں سے :</Text>
                  </View>
                  <View style={styles.fieldDivider} />
                  <View style={styles.keyValueRow}>
                    <Text style={styles.keyValueText}>
                      {sabaqTo || 'سورۃ البقرہ، آیت ۱۲'}
                    </Text>
                    <Text style={styles.keyLabelText}>کہاں تک :</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.mutedText}>سبق نہیں سنایا</Text>
              )}
            </RoznamaPreviewCard>

            {/* Card 4: سبقی سنائی (Shows 'نہیں' in red if false matching Image 3) */}
            <View style={styles.simpleStatusCard}>
              <Text
                style={[
                  styles.statusIndicatorText,
                  !hasSabqi && styles.statusIndicatorRed,
                ]}
              >
                {hasSabqi ? 'ہاں' : 'نہیں'}
              </Text>
              <Text style={styles.simpleStatusTitle}>سبقی سنائی</Text>
            </View>

            {hasSabqi && (
              <RoznamaPreviewCard title="سبقی کی تفصیل">
                <View style={styles.keyValueRow}>
                  <Text style={styles.keyValueText}>
                    {toUrduDigits(sabqiMistakes)}
                  </Text>
                  <Text style={styles.keyLabelText}>غلطیاں :</Text>
                </View>
              </RoznamaPreviewCard>
            )}

            {/* Card 5: منزل سنائی (with Manzil entries matching Image 3) */}
            <RoznamaPreviewCard
              title="منزل سنائی"
              badgeText={hasManzil ? 'ہاں' : 'نہیں'}
            >
              {hasManzil && manzilEntries.length > 0 ? (
                manzilEntries.map((item, idx) => (
                  <View key={item.id} style={styles.manzilPreviewItem}>
                    <Text style={styles.manzilPreviewTitle}>
                      منزل {toUrduDigits(idx + 1)} : {item.paraName} ({toUrduDigits(item.paraNumber)})
                    </Text>
                    <View style={styles.fieldDivider} />
                    <View style={styles.keyValueRow}>
                      <Text style={styles.keyValueText}>{item.portion}</Text>
                      <Text style={styles.keyLabelText}>کتنا سنایا :</Text>
                    </View>
                    <View style={styles.keyValueRow}>
                      <Text style={styles.keyValueText}>{toUrduDigits(item.mistakes)}</Text>
                      <Text style={styles.keyLabelText}>غلطیاں :</Text>
                    </View>
                    <View style={styles.keyValueRow}>
                      <Text style={styles.keyValueText}>
                        {item.recitedTo === 'student'
                          ? item.listenerStudentName || 'طالب علم'
                          : 'قاری صاحب'}
                      </Text>
                      <Text style={styles.keyLabelText}>کس نے سنا :</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.mutedText}>منزل نہیں سنائی</Text>
              )}
            </RoznamaPreviewCard>
          </>
        ) : (
          // Nazra Preview Flow
          <>
            <RoznamaPreviewCard
              title="سبق سنایا"
              badgeText={hasSabaq ? 'ہاں' : 'نہیں'}
            >
              {hasSabaq ? (
                <>
                  <Text style={styles.previewFieldValue}>
                    {lessonStage === 'qaeda' ? 'قاعدہ' : 'سبق'}
                  </Text>
                  <View style={styles.fieldDivider} />
                  <Text style={styles.previewFieldValue}>
                    تختی نمبر : {toUrduDigits(boardNumber)}
                  </Text>
                </>
              ) : (
                <Text style={styles.mutedText}>سبق نہیں سنایا</Text>
              )}
            </RoznamaPreviewCard>

            <RoznamaPreviewCard
              title="سبقی سنائی"
              badgeText={hasSabqi ? 'ہاں' : 'نہیں'}
            >
              {hasSabqi ? (
                <Text style={styles.previewFieldValue}>
                  غلطیاں : {toUrduDigits(sabqiMistakes)}
                </Text>
              ) : (
                <Text style={styles.mutedText}>سبقی نہیں سنائی</Text>
              )}
            </RoznamaPreviewCard>
          </>
        )}

        {/* Teacher Opinion Preview */}
        <RoznamaPreviewCard title="استاد کی رائے">
          <Text style={styles.previewFieldValue}>
            {teacherOpinion || 'اے - ون'}
          </Text>
        </RoznamaPreviewCard>
      </ScrollView>

      {/* Action Buttons matching Image 3 */}
      <View style={styles.bottomBar}>
        <View style={styles.buttonsRow}>
          <Button
            title="محفوظ کریں"
            onPress={handleSave}
            isLoading={isSaving}
            style={styles.halfButton}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="واپس کریں"
            onPress={handleGoBack}
            variant="outline"
            disabled={isSaving}
            style={styles.halfButton}
          />
        </View>
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
  simpleStatusCard: {
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
  simpleStatusTitle: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#2A4438',
  },
  statusIndicatorText: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '600',
    color: '#3F725F',
  },
  statusIndicatorRed: {
    color: '#D92626',
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  keyLabelText: {
    ...Typography.label,
    fontSize: 15,
    color: '#181815',
  },
  keyValueText: {
    ...Typography.hint,
    fontSize: 15,
    color: '#3F725F',
    fontWeight: '600',
  },
  previewFieldValue: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
    fontWeight: '500',
  },
  manzilPreviewItem: {
    marginBottom: 8,
  },
  manzilPreviewTitle: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
  },
  mutedText: {
    ...Typography.hint,
    fontSize: 15,
    color: '#7A8C84',
    textAlign: 'right',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#DCE7E2',
    marginVertical: 8,
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
