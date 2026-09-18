import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  MANZIL_PORTIONS,
  ManzilEntry,
  QURAN_PARAS,
} from '@/types/roznama.types';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Button } from '@/components/Button/Button';
import { toUrduDigits } from '@/app/(tabs)/home';

interface ManzilModalProps {
  visible: boolean;
  mode: 'add' | 'edit';
  initialData?: ManzilEntry | null;
  onClose: () => void;
  onSave: (data: Omit<ManzilEntry, 'id'>) => void;
}

export function ManzilModal({
  visible,
  mode,
  initialData,
  onClose,
  onSave,
}: ManzilModalProps) {
  const [paraNumber, setParaNumber] = useState<number>(12);
  const [portion, setPortion] = useState<string>('ربع');
  const [mistakes, setMistakes] = useState<string>('۵');
  const [recitedTo, setRecitedTo] = useState<'qari' | 'student'>('qari');
  const [listenerStudentName, setListenerStudentName] = useState<string>('');

  // Dropdown Pickers Modals
  const [paraPickerVisible, setParaPickerVisible] = useState(false);
  const [portionPickerVisible, setPortionPickerVisible] = useState(false);

  useEffect(() => {
    if (initialData) {
      setParaNumber(initialData.paraNumber || 12);
      setPortion(initialData.portion || 'ربع');
      setMistakes(String(initialData.mistakes ?? '۵'));
      setRecitedTo(initialData.recitedTo || 'qari');
      setListenerStudentName(initialData.listenerStudentName || '');
    } else {
      setParaNumber(12);
      setPortion('ربع');
      setMistakes('۵');
      setRecitedTo('qari');
      setListenerStudentName('');
    }
  }, [initialData, visible]);

  const selectedPara =
    QURAN_PARAS.find((p) => p.number === paraNumber) || QURAN_PARAS[11];

  const handleSave = () => {
    // Early validation
    const parsedMistakes = parseInt(
      mistakes.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))),
      10
    );

    onSave({
      paraNumber,
      paraName: selectedPara.name,
      portion,
      mistakes: isNaN(parsedMistakes) ? 0 : parsedMistakes,
      recitedTo,
      listenerStudentName:
        recitedTo === 'student' ? listenerStudentName.trim() || 'احمد' : undefined,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Title matching Image 5 */}
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {mode === 'add' ? 'منزل شامل کریں' : 'منزل ترمیم کریں'}
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Field 1: پارہ نمبر */}
                <Text style={styles.fieldLabel}>پارہ نمبر</Text>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setParaPickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-down" size={18} color="#6B7A6E" />
                  <Text style={styles.dropdownText}>
                    {selectedPara
                      ? `پارہ ${toUrduDigits(selectedPara.number)} : ${selectedPara.name}`
                      : 'پارہ نمبر منتخب کریں'}
                  </Text>
                </TouchableOpacity>

                {/* Field 2: کتنا سنایا */}
                <Text style={styles.fieldLabel}>کتنا سنایا</Text>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setPortionPickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-down" size={18} color="#6B7A6E" />
                  <Text style={styles.dropdownText}>
                    {portion || 'حصہ منتخب کریں'}
                  </Text>
                </TouchableOpacity>

                {/* Field 3: غلطیاں */}
                <Text style={styles.fieldLabel}>غلطیاں</Text>
                <TextInput
                  style={styles.textInput}
                  value={mistakes}
                  onChangeText={setMistakes}
                  placeholder="تعداد لکھیں"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="numeric"
                  textAlign="right"
                />

                {/* Field 4: کس نے سنا (Isolated Listener Selector) */}
                <Text style={styles.fieldLabel}>کس نے سنا</Text>
                <View style={styles.listenerToggle}>
                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      recitedTo === 'student' && styles.toggleOptionActive,
                    ]}
                    onPress={() => setRecitedTo('student')}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.toggleOptionText,
                        recitedTo === 'student' && styles.toggleOptionTextActive,
                      ]}
                    >
                      طالب علم نے
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      recitedTo === 'qari' && styles.toggleOptionActive,
                    ]}
                    onPress={() => setRecitedTo('qari')}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.toggleOptionText,
                        recitedTo === 'qari' && styles.toggleOptionTextActive,
                      ]}
                    >
                      قاری صاحب
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Conditional Field: طالب علم کا نام (Visible ONLY if recitedTo === 'student') */}
                {recitedTo === 'student' && (
                  <View style={styles.conditionalContainer}>
                    <Text style={styles.fieldLabel}>طالب علم کا نام</Text>
                    <TextInput
                      style={styles.textInput}
                      value={listenerStudentName}
                      onChangeText={setListenerStudentName}
                      placeholder="طالب علم کا نام لکھیں..."
                      placeholderTextColor="#9E9E9E"
                      textAlign="right"
                    />
                  </View>
                )}

                {/* Save Button matching Image 5 */}
                <Button
                  title="محفوظ کریں"
                  onPress={handleSave}
                  style={styles.saveButton}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Para Picker Sub-Modal */}
      <Modal
        visible={paraPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setParaPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setParaPickerVisible(false)}>
          <View style={styles.subModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.subModalContent}>
                <Text style={styles.subModalTitle}>پارہ منتخب کریں</Text>
                <FlatList
                  data={QURAN_PARAS}
                  keyExtractor={(item) => String(item.number)}
                  style={{ maxHeight: 320 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        paraNumber === item.number && styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setParaNumber(item.number);
                        setParaPickerVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          paraNumber === item.number &&
                            styles.pickerItemTextSelected,
                        ]}
                      >
                        پارہ {toUrduDigits(item.number)} : {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Portion Picker Sub-Modal */}
      <Modal
        visible={portionPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPortionPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPortionPickerVisible(false)}>
          <View style={styles.subModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.subModalContent}>
                <Text style={styles.subModalTitle}>کتنا سنایا</Text>
                {MANZIL_PORTIONS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.pickerItem,
                      portion === item && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      setPortion(item);
                      setPortionPickerVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        portion === item && styles.pickerItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    ...Typography.title,
    fontSize: 20,
    fontWeight: '700',
    color: '#181815',
  },
  fieldLabel: {
    ...Typography.label,
    fontSize: 16,
    fontWeight: '600',
    color: '#3F725F',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 6,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#7DA998',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
  },
  textInput: {
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#7DA998',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#181815',
  },
  listenerToggle: {
    flexDirection: 'row',
    backgroundColor: '#FCFAF5',
    borderWidth: 1,
    borderColor: '#7DA998',
    borderRadius: 12,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: Colors.primary,
  },
  toggleOptionText: {
    ...Typography.label,
    fontSize: 15,
    color: '#6B7A6E',
  },
  toggleOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  conditionalContainer: {
    marginTop: 4,
  },
  saveButton: {
    marginTop: 22,
    borderRadius: 14,
    paddingVertical: 14,
  },
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  subModalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: Spacing.md,
    maxHeight: 400,
  },
  subModalTitle: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: '#EEF6F2',
  },
  pickerItemText: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
  },
  pickerItemTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
