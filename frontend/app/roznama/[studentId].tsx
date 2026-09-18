import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActionHeader } from '@/components/ActionHeader/ActionHeader';
import { BadgeTag } from '@/components/BadgeTag/BadgeTag';
import { Button } from '@/components/Button/Button';
import { ManzilCard } from '@/components/ManzilCard/ManzilCard';
import { ManzilModal } from '@/components/ManzilModal/ManzilModal';
import { useRoznamaForm } from '@/hooks/useRoznamaForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { toUrduDigits } from '@/app/(tabs)/home';
import { LessonStage, ManzilEntry } from '@/types/roznama.types';

export default function RoznamaEntryScreen() {
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
    // Actions
    setHasSabaq,
    setLessonStage,
    setBoardNumber,
    setSabaqFrom,
    setSabaqTo,
    setHasSabqi,
    setSabqiMistakes,
    setIsParaComplete,
    setCompletedParaNumber,
    setHasManzil,
    addManzil,
    editManzil,
    deleteManzil,
    setTeacherOpinion,
  } = useRoznamaForm(studentId || '');

  // Manzil Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedManzil, setSelectedManzil] = useState<ManzilEntry | null>(null);

  // Early return — Loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Early return — Error or missing student
  if (errorMessage || !student) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage ?? 'طالب علم نہیں ملا'}</Text>
      </SafeAreaView>
    );
  }

  const handleOpenAddModal = () => {
    setSelectedManzil(null);
    setModalMode('add');
    setModalVisible(true);
  };

  const handleOpenEditModal = (item: ManzilEntry) => {
    setSelectedManzil(item);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleSaveManzil = (data: Omit<ManzilEntry, 'id'>) => {
    if (modalMode === 'add') {
      addManzil(data);
    } else if (selectedManzil) {
      editManzil(selectedManzil.id, data);
    }
  };

  const handlePreview = () => {
    router.push(`/roznama/preview/${student.id}`);
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
          {/* Card 1: Student Header matching Screenshots */}
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

          {/* Hifz Mode Only: پارہ مکمل؟ Card (Image 1 & 2) */}
          {isHifz && (
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <Switch
                  value={isParaComplete}
                  onValueChange={setIsParaComplete}
                  trackColor={{ false: '#D9D9D9', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
                <Text style={styles.cardLabel}>پارہ مکمل؟</Text>
              </View>

              {isParaComplete && (
                <View style={styles.subContent}>
                  <View style={styles.numberInputRow}>
                    <TextInput
                      style={styles.textInputRTL}
                      value={completedParaNumber ?? ''}
                      onChangeText={setCompletedParaNumber}
                      placeholder="۱ الم"
                      placeholderTextColor="#9E9E9E"
                      textAlign="right"
                    />
                    <Text style={styles.inputRowLabel}>پارہ :</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Card: سبق Toggle + Details */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <Switch
                value={hasSabaq}
                onValueChange={setHasSabaq}
                trackColor={{ false: '#D9D9D9', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.cardLabel}>سبق</Text>
            </View>

            {hasSabaq && (
              <View style={styles.subContent}>
                {isHifz ? (
                  // Hifz Sabaq: کہاں سے / کہاں تک inputs (Image 3)
                  <>
                    <View style={styles.numberInputRow}>
                      <TextInput
                        style={styles.textInputRTL}
                        value={sabaqFrom}
                        onChangeText={setSabaqFrom}
                        placeholder="سورۃ البقرہ، آیت ۵"
                        placeholderTextColor="#9E9E9E"
                        textAlign="right"
                      />
                      <Text style={styles.inputRowLabel}>کہاں سے :</Text>
                    </View>
                    <View style={{ height: 8 }} />
                    <View style={styles.numberInputRow}>
                      <TextInput
                        style={styles.textInputRTL}
                        value={sabaqTo}
                        onChangeText={setSabaqTo}
                        placeholder="سورۃ البقرہ، آیت ۱۲"
                        placeholderTextColor="#9E9E9E"
                        textAlign="right"
                      />
                      <Text style={styles.inputRowLabel}>کہاں تک :</Text>
                    </View>
                  </>
                ) : (
                  // Nazra Sabaq: قاعدہ / سبق + تختی نمبر (Screenshot 2)
                  <>
                    <View style={styles.stageToggleRow}>
                      {(['qaeda', 'sabaq'] as LessonStage[]).map((stage) => {
                        const isSelected = lessonStage === stage;
                        return (
                          <TouchableOpacity
                            key={stage}
                            style={[
                              styles.stageChip,
                              isSelected && styles.stageChipSelected,
                            ]}
                            onPress={() => setLessonStage(stage)}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.stageChipText,
                                isSelected && styles.stageChipTextSelected,
                              ]}
                            >
                              {stage === 'qaeda' ? 'قاعدہ' : 'سبق'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {lessonStage === 'qaeda' && (
                      <View style={styles.numberInputRow}>
                        <TextInput
                          style={styles.numberInput}
                          value={boardNumber}
                          onChangeText={setBoardNumber}
                          keyboardType="numeric"
                          textAlign="center"
                        />
                        <Text style={styles.inputRowLabel}>تختی نمبر :</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          </View>

          {/* Card: سبقی سنائی Toggle + Details */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <Switch
                value={hasSabqi}
                onValueChange={setHasSabqi}
                trackColor={{ false: '#D9D9D9', true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.cardLabel}>سبقی سنائی</Text>
            </View>

            {hasSabqi && (
              <View style={styles.subContent}>
                <View style={styles.numberInputRow}>
                  <TextInput
                    style={styles.numberInput}
                    value={sabqiMistakes}
                    onChangeText={setSabqiMistakes}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                  <Text style={styles.inputRowLabel}>غلطیاں :</Text>
                </View>
              </View>
            )}
          </View>

          {/* Hifz Mode Only: منزل سنائی Card + Dynamic Manzil Cards (Image 2) */}
          {isHifz && (
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <Switch
                  value={hasManzil}
                  onValueChange={setHasManzil}
                  trackColor={{ false: '#D9D9D9', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
                <Text style={styles.cardLabel}>منزل سنائی</Text>
              </View>

              {hasManzil && (
                <View style={styles.subContent}>
                  {/* Dynamic Manzil Cards List */}
                  {manzilEntries.map((item, idx) => (
                    <ManzilCard
                      key={item.id}
                      manzil={item}
                      index={idx}
                      onEdit={handleOpenEditModal}
                      onDelete={deleteManzil}
                    />
                  ))}

                  {/* Add Manzil Dotted Button matching Image 2 */}
                  <TouchableOpacity
                    style={styles.addManzilButton}
                    onPress={handleOpenAddModal}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addPlusText}>+</Text>
                    <Text style={styles.addManzilText}>منزل شامل کریں</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Card: استاد کی رائے (Teacher Opinion) */}
          <View style={styles.card}>
            <Text style={styles.opinionHeader}>استاد کی رائے</Text>
            <TextInput
              style={styles.opinionInput}
              value={teacherOpinion}
              onChangeText={setTeacherOpinion}
              placeholder="اے - ون"
              placeholderTextColor="#9E9E9E"
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button matching Screenshots */}
      <View style={styles.bottomBar}>
        <Button
          title="پیش نظر دیکھیں"
          onPress={handlePreview}
          style={styles.previewButton}
        />
      </View>

      {/* Manzil Add/Edit Modal (Image 5) */}
      <ManzilModal
        visible={modalVisible}
        mode={modalMode}
        initialData={selectedManzil}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveManzil}
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
  },
  subContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF4F0',
  },
  stageToggleRow: {
    flexDirection: 'row-reverse',
    marginBottom: 12,
  },
  stageChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7DA998',
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  stageChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stageChipText: {
    ...Typography.hint,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  stageChipTextSelected: {
    color: '#FFFFFF',
  },
  numberInputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCFAF5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B8CFC5',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  inputRowLabel: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
  },
  numberInput: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '700',
    color: '#3F725F',
    minWidth: 40,
  },
  textInputRTL: {
    ...Typography.label,
    fontSize: 15,
    color: '#181815',
    flex: 1,
    marginRight: 8,
  },
  addManzilButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7DA998',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFAF5',
    marginTop: 4,
  },
  addPlusText: {
    fontSize: 20,
    color: '#3F725F',
    fontWeight: '700',
    marginBottom: 2,
  },
  addManzilText: {
    ...Typography.label,
    fontSize: 16,
    color: '#3F725F',
    fontWeight: '600',
  },
  opinionHeader: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 10,
  },
  opinionInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8CFC5',
    borderRadius: 12,
    minHeight: 90,
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
