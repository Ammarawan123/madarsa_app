import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { ApiAttendanceStrategy } from '@/services/attendance/ApiAttendanceStrategy';
import { StudentAttendanceItem, StudentHistoryDetail } from '@/types/attendance-marking.types';

const URDU_DIGITS: readonly string[] = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const URDU_MONTHS: readonly string[] = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
];

function toUrduDigits(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '۰';
  return String(val).replace(/[0-9]/g, (d) => URDU_DIGITS[Number(d)]);
}

// Fixed Month parsing logic
function parseUrduMonth(monthVal?: any, fallbackDate?: any): string {
  if (typeof monthVal === 'number' && monthVal >= 1 && monthVal <= 12) {
    return URDU_MONTHS[monthVal - 1];
  }

  if (typeof monthVal === 'string' && monthVal.trim() !== '') {
    const num = parseInt(monthVal, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return URDU_MONTHS[num - 1];
    }
  }

  const dateToParse = fallbackDate ? new Date(fallbackDate) : new Date();
  if (!isNaN(dateToParse.getTime())) {
    return URDU_MONTHS[dateToParse.getMonth()];
  }

  return URDU_MONTHS[new Date().getMonth()];
}

function getUrduTrack(grade?: string): string {
  const g = String(grade || '').toUpperCase();
  if (g.includes('HIFZ')) return 'حفظ';
  if (g.includes('NAZRA') || g.includes('NAZIRA')) return 'ناظرہ';
  return grade || 'حفظ';
}

export default function AttendanceScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [markAllPresent, setMarkAllPresent] = useState(false);

  // Selected Student & History State
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceItem | null>(null);
  const [historyDetail, setHistoryDetail] = useState<StudentHistoryDetail | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  useEffect(() => {
    attendanceService.setStrategy(new ApiAttendanceStrategy());
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await attendanceService.getTodayAttendanceList('default');

      const mapped: StudentAttendanceItem[] = (data || []).map((s) => ({
        ...s,
        status: (s.status as any) || 'PRESENT',
      }));

      setStudents(mapped);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [fetchStudents])
  );

  const fetchStudentHistory = async (student: StudentAttendanceItem) => {
    setSelectedStudent(student);
    setIsLoadingHistory(true);
    setHistoryDetail(null);
    try {
      const detail = await attendanceService.getStudentHistoryDetail(String(student.id));
      setHistoryDetail(detail);
    } catch (error) {
      console.error('Error fetching student history detail:', error);
      Alert.alert('خرابی', 'طالب علم کی سابقہ حاضری لوڈ کرنے میں ناکامی ہوئی');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleStatus = (id: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        String(student.id) === String(id)
          ? { ...student, status: newStatus as any }
          : student
      )
    );
  };

  const handleMarkAllPresent = () => {
    const nextState = !markAllPresent;
    setMarkAllPresent(nextState);
    if (nextState) {
      setStudents((prev) => prev.map((s) => ({ ...s, status: 'PRESENT' as any })));
    }
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;

    try {
      setIsSubmitting(true);
      const success = await attendanceService.submitAttendance(students);
      if (success) {
        Alert.alert('کامیابی', 'تمام طلبہ کی حاضری کامیابی سے درج ہو گئی ہے');
      } else {
        Alert.alert('خرابی', 'حاضری درج کرنے میں ناکامی ہوئی');
      }
    } catch (error: any) {
      Alert.alert(
        'خرابی',
        error?.response?.data?.message || 'حاضری درج کرنے میں ناکامی ہوئی'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topIconBar}>
        {selectedStudent && activeTab === 'history' ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setSelectedStudent(null);
              setHistoryDetail(null);
            }}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#2d6a4f" />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="chatbubble-outline" size={18} color="#2d6a4f" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={18} color="#2d6a4f" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.pageTitle}>
        {selectedStudent && activeTab === 'history'
          ? 'سابقہ حاضری'
          : activeTab === 'today'
          ? 'طلبہ کی حاضری'
          : 'سابقہ حاضری'}
      </Text>

      {!selectedStudent && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'today' && styles.activeTabBtn]}
            onPress={() => {
              setActiveTab('today');
              setSelectedStudent(null);
            }}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
              آج کی حاضری
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.activeTabBtn]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              سابقہ حاضری
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TODAY ATTENDANCE TAB */}
      {activeTab === 'today' && (
        <>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="طلبہ تلاش کریں"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search-outline" size={18} color="#999" />
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.checkboxRow} onPress={handleMarkAllPresent}>
              <View style={[styles.checkbox, markAllPresent && styles.checkboxChecked]}>
                {markAllPresent && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              <Text style={styles.filterText}>سب کو حاضر کریں</Text>
            </TouchableOpacity>

            <View style={styles.dropdownBtn}>
              <Ionicons name="chevron-down-outline" size={14} color="#666" />
              <Text style={styles.dropdownText}>حالت</Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2d6a4f" />
            </View>
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>کوئی طالب علم موجود نہیں</Text>}
              renderItem={({ item }) => {
                const currentStatus = String(item.status || '').toUpperCase();

                return (
                  <View style={styles.studentCard}>
                    <View style={styles.studentHeaderRow}>
                      <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={18} color="#FFF" />
                      </View>
                      <View style={styles.nameDetails}>
                        <Text style={styles.studentName}>
                          {item.name} <Text style={styles.classSubtitle}>— {getUrduTrack(item.grade)}</Text>
                        </Text>
                        {item.rollNumber ? (
                          <Text style={styles.rollNo}>
                            رول نمبر: {toUrduDigits(item.rollNumber)}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          styles.leaveBtn,
                          currentStatus === 'LEAVE' && styles.leaveBtnActive,
                        ]}
                        onPress={() => toggleStatus(String(item.id), 'LEAVE')}
                      >
                        <Text
                          style={[
                            styles.btnText,
                            currentStatus === 'LEAVE' ? styles.activeBtnText : styles.leaveText,
                          ]}
                        >
                          عارضی
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          styles.absentBtn,
                          currentStatus === 'ABSENT' && styles.absentBtnActive,
                        ]}
                        onPress={() => toggleStatus(String(item.id), 'ABSENT')}
                      >
                        <Ionicons
                          name="person-outline"
                          size={13}
                          color={currentStatus === 'ABSENT' ? '#FFF' : '#d9534f'}
                        />
                        <Text
                          style={[
                            styles.btnText,
                            currentStatus === 'ABSENT' ? styles.activeBtnText : styles.absentText,
                          ]}
                        >
                          غیر حاضر
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          styles.presentBtn,
                          currentStatus === 'PRESENT' && styles.presentBtnActive,
                        ]}
                        onPress={() => toggleStatus(String(item.id), 'PRESENT')}
                      >
                        <Ionicons
                          name="person-outline"
                          size={13}
                          color={currentStatus === 'PRESENT' ? '#FFF' : '#2d6a4f'}
                        />
                        <Text
                          style={[
                            styles.btnText,
                            currentStatus === 'PRESENT' ? styles.activeBtnText : styles.presentText,
                          ]}
                        >
                          حاضر
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>حاضری جمع کریں</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* HISTORY TAB LIST */}
      {activeTab === 'history' && !selectedStudent && (
        <>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="طلبہ تلاش کریں"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search-outline" size={18} color="#999" />
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2d6a4f" />
            </View>
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>کوئی طالب علم موجود نہیں</Text>}
              renderItem={({ item }) => {
                const currentStatus = String(item.status || '').toUpperCase();

                return (
                  <TouchableOpacity
                    style={styles.historyStudentCard}
                    onPress={() => fetchStudentHistory(item)}
                  >
                    <View
                      style={[
                        styles.statusBadge,
                        currentStatus === 'LEAVE'
                          ? styles.leaveBadge
                          : currentStatus === 'ABSENT'
                          ? styles.absentBadge
                          : styles.presentBadge,
                      ]}
                    >
                      <Text style={styles.statusBadgeText}>
                        {currentStatus === 'LEAVE'
                          ? 'عارضی'
                          : currentStatus === 'ABSENT'
                          ? 'غیر حاضر'
                          : 'حاضر'}
                      </Text>
                    </View>

                    <View style={styles.studentHeaderRow}>
                      <View style={styles.nameDetails}>
                        <Text style={styles.studentName}>
                          {item.name} <Text style={styles.classSubtitle}>— {getUrduTrack(item.grade)}</Text>
                        </Text>
                        <Text style={styles.rollNo}>
                          رول نمبر: {toUrduDigits(item.rollNumber || '')}
                        </Text>
                      </View>
                      <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={18} color="#FFF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </>
      )}

      {/* INDIVIDUAL STUDENT HISTORY DETAIL */}
      {activeTab === 'history' && selectedStudent && (
        <>
          {isLoadingHistory ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2d6a4f" />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.historyDetailContainer}>
              <View style={styles.studentDetailBanner}>
                <View style={styles.bannerRow}>
                  <Text style={styles.bannerText}>
                    درجہ: {getUrduTrack((historyDetail as any)?.grade || selectedStudent.grade)}
                  </Text>
                  <Text style={styles.bannerStudentName}>
                    {(historyDetail as any)?.name || selectedStudent.name}
                  </Text>
                </View>
                <View style={styles.bannerRow}>
                  <Text style={styles.bannerText}>
                    مہینہ: {(historyDetail as any)?.monthName || parseUrduMonth((historyDetail as any)?.month, historyDetail?.history?.[0]?.date)}
                  </Text>
                  <Text style={styles.bannerText}>
                    رول نمبر: {toUrduDigits((historyDetail as any)?.rollNumber || selectedStudent.rollNumber || '')}
                  </Text>
                </View>
              </View>

              <View style={styles.historySectionHeader}>
                <TouchableOpacity style={styles.monthPickerBtn}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.monthPickerText}>
                    {`${(historyDetail as any)?.monthName || parseUrduMonth((historyDetail as any)?.month, historyDetail?.history?.[0]?.date)} ${toUrduDigits(new Date().getFullYear())}`}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.historySectionTitle}>فہرست</Text>
              </View>

              {(!historyDetail?.history || historyDetail.history.length === 0) ? (
                <Text style={styles.emptyText}>کوئی سابقہ حاضری کا ریکارڈ نہیں ملا</Text>
              ) : (
                historyDetail.history.map((entry: any, index: number) => {
                  const entryStatus = String(entry.status || entry.badgeType || '').toUpperCase();
                  const dateDisplay = entry.date || entry.formattedDate || entry.dayName || '';

                  return (
                    <View
                      key={entry.id || index}
                      style={[
                        styles.historyCard,
                        entryStatus === 'ABSENT' && styles.absentCardBorder,
                      ]}
                    >
                      <View
                        style={[
                          styles.historyStatusPill,
                          entryStatus === 'PRESENT' && styles.presentPill,
                          entryStatus === 'LEAVE' && styles.leavePill,
                          entryStatus === 'ABSENT' && styles.absentPill,
                        ]}
                      >
                        <Text style={styles.pillText}>
                          {entryStatus === 'PRESENT'
                            ? 'حاضر'
                            : entryStatus === 'LEAVE'
                            ? 'رخصت'
                            : 'غیر حاضر'}
                        </Text>
                      </View>

                      <Text style={styles.historyDateText}>{dateDisplay}</Text>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topIconBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d6a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
    marginTop: 2,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#EFEFEF',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#2d6a4f',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: '#333',
    marginRight: 6,
  },
  filterRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2d6a4f',
    borderColor: '#2d6a4f',
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  dropdownText: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 14,
  },
  studentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  historyStudentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#52796F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  nameDetails: {
    alignItems: 'flex-end',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  classSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  rollNo: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  leaveBadge: { backgroundColor: '#c2b380' },
  absentBadge: { backgroundColor: '#d9534f' },
  presentBadge: { backgroundColor: '#2d6a4f' },
  statusBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  presentBtn: { borderColor: '#2d6a4f', backgroundColor: '#FFF' },
  presentText: { color: '#2d6a4f' },
  presentBtnActive: { backgroundColor: '#2d6a4f' },

  absentBtn: { borderColor: '#d9534f', backgroundColor: '#FFF' },
  absentText: { color: '#d9534f' },
  absentBtnActive: { backgroundColor: '#d9534f' },

  leaveBtn: { borderColor: '#b5a363', backgroundColor: '#c2b380' },
  leaveText: { color: '#FFF' },
  leaveBtnActive: { backgroundColor: '#8d7f4b', borderColor: '#8d7f4b' },

  btnText: { fontSize: 12, fontWeight: '500' },
  activeBtnText: { color: '#FFF', fontWeight: '600' },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  historyDetailContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 6,
  },
  studentDetailBanner: {
    backgroundColor: '#2d6a4f',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bannerStudentName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bannerText: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  historySectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  monthPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    backgroundColor: '#FFF',
  },
  monthPickerText: {
    fontSize: 12,
    color: '#444',
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  absentCardBorder: {
    borderColor: '#fccac8',
  },
  historyDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  historyStatusPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  presentPill: { backgroundColor: '#2d6a4f' },
  leavePill: { backgroundColor: '#c2b380' },
  absentPill: { backgroundColor: '#d9534f' },
  pillText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
});