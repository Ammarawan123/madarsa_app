import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconCircle } from '@/components/IconCircle/IconCircle';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { SegmentedToggle } from '@/components/SegmentedToggle/SegmentedToggle';
import { StudentCard } from '@/components/StudentCard/StudentCard';
import { Button } from '@/components/Button/Button';
import { useRoznamaList } from '@/hooks/useRoznamaList';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Student, StudentClassType } from '@/types/roznama.types';
import { StatusFilter } from '@/store/useRoznamaStore';

const CLASS_OPTIONS = [
  { value: 'nazira' as StudentClassType, label: 'ناظرہ' },
  { value: 'hifz' as StudentClassType, label: 'حفظ' },
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'تمام حالتیں' },
  { value: 'pending', label: 'باقی ہے' },
  { value: 'draft', label: 'مسودہ' },
  { value: 'completed', label: 'مکمل' },
];

export default function RoznamaListScreen() {
  const router = useRouter();
  const {
    students,
    selectedClass,
    statusFilter,
    searchQuery,
    isLoading,
    errorMessage,
    setSelectedClass,
    setStatusFilter,
    setSearchQuery,
    submitAllRoznamas,
  } = useRoznamaList();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  // Early return — Loading
  if (isLoading && students.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Early return — Error state
  if (errorMessage && students.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  const handleStudentPress = (student: Student) => {
    if (student.status === 'completed') {
      router.push(`/roznama/view/${student.id}`);
    } else {
      router.push(`/roznama/${student.id}`);
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmittingAll(true);
    await submitAllRoznamas();
    setIsSubmittingAll(false);
  };

  const activeStatusLabel =
    STATUS_FILTER_OPTIONS.find((opt) => opt.value === statusFilter)?.label ?? 'حالت';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header matching Screenshot 1 */}
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <IconCircle
              iconSource={require('@/assets/icons/bell-icon.png')}
              showDot={true}
            />
            <View style={{ width: 8 }} />
            <IconCircle iconSource={require('@/assets/icons/message-icon.png')} />
          </View>

          <Text style={styles.headerTitle}>روزنامہ</Text>
        </View>

        {/* Segmented Control (Hifz / Nazra) — Default Nazra */}
        <SegmentedToggle
          options={CLASS_OPTIONS}
          value={selectedClass}
          onChange={setSelectedClass}
        />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="طلبہ تلاش کریں"
        />

        {/* Section Subheader: "فہرست" and "حالت ⌵" Filter */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            <Text style={styles.filterButtonText}>
              {statusFilter === 'all' ? 'حالت' : activeStatusLabel}
            </Text>
          </TouchableOpacity>

          <Text style={styles.subHeaderTitle}>فہرست</Text>
        </View>

        {/* Students List */}
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onPress={() => handleStudentPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>کوئی طالب علم نہیں ملا</Text>
            </View>
          }
        />

        {/* Bottom Submit All Roznamas Button (Screenshot 4) */}
        <View style={styles.bottomBar}>
          <Button
            title="تمام روزنامے جمع کریں"
            onPress={handleSubmitAll}
            isLoading={isSubmittingAll}
            style={styles.submitAllButton}
          />
        </View>
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeading}>حالت منتخب کریں</Text>
                <View style={styles.modalDivider} />
                {STATUS_FILTER_OPTIONS.map((opt) => {
                  const isSelected = statusFilter === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setStatusFilter(opt.value);
                        setFilterModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title,
    fontSize: 24,
    fontWeight: '700',
    color: '#181815',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  subHeaderTitle: {
    ...Typography.sectionHeading,
    fontSize: 20,
    fontWeight: '700',
    color: '#181815',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7DA998',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: {
    ...Typography.hint,
    fontSize: 14,
    color: '#3F725F',
    fontWeight: '600',
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    paddingTop: 8,
    backgroundColor: Colors.background,
  },
  submitAllButton: {
    borderRadius: 14,
    paddingVertical: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeading: {
    ...Typography.label,
    fontSize: 18,
    fontWeight: '700',
    color: '#181815',
    textAlign: 'right',
    marginBottom: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5EFEA',
    marginBottom: 8,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#EEF6F2',
  },
  modalOptionText: {
    ...Typography.label,
    fontSize: 16,
    color: '#181815',
    textAlign: 'right',
  },
  modalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
