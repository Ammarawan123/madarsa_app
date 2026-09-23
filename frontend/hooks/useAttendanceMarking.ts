import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { StudentAttendanceItem, MarkStatus } from '@/types/attendance-marking.types';

export function useAttendanceMarking(classId: string = 'class-alif') {
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const lastFetchedTimeRef = useRef(0);

  const loadStudents = useCallback(async (force = false) => {
    const now = Date.now();
    if (isFetchingRef.current) return;
    if (!force && now - lastFetchedTimeRef.current < 2500 && students.length > 0) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading((prev) => (students.length === 0 ? true : prev));
    setErrorMessage(null);

    try {
      const response = await attendanceService.getTodayAttendanceList(classId);
      const rawList = Array.isArray(response)
        ? response
        : (response as any)?.data || (response as any)?.students || [];

      const normalizedList: StudentAttendanceItem[] = rawList.map((item: any) => ({
        id: String(item.id),
        name: item.name || item.fullName || item.full_name || '',
        grade: item.grade || item.trackType || item.track_type || '',
        rollNumber: item.rollNumber || item.roll_number || '',
        status: item.status === 'ACTIVE' ? null : (item.status || null),
      }));

      setStudents(normalizedList);
      lastFetchedTimeRef.current = Date.now();
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      setErrorMessage(
        isRateLimit
          ? 'بہت زیادہ درخواستیں بھیجی گئیں۔ براہ کرم تھوڑی دیر بعد کوشش کریں۔'
          : 'فہرست لوڈ نہیں ہو سکی'
      );
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [classId]);

  // Initial load
  useEffect(() => {
    loadStudents(true);
  }, [classId]);

  // Controlled refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      loadStudents(false);
    }, [loadStudents])
  );

  const setStudentStatus = useCallback((studentId: string, status: MarkStatus) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, status } : student))
    );
  }, []);

  const markAllPresent = useCallback((allPresent: boolean) => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: allPresent ? 'present' : null }))
    );
  }, []);

  const submit = useCallback(async () => {
    if (students.length === 0) return false;
    setIsSubmitting(true);

    try {
      const success = await attendanceService.submitAttendance(students);
      if (!success) {
        throw new Error('حاضری محفوظ نہیں ہو سکی');
      }
      return true;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    return students.filter((student) => student.name.includes(searchQuery.trim()));
  }, [students, searchQuery]);

  return {
    students: filteredStudents,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSubmitting,
    errorMessage,
    setStudentStatus,
    markAllPresent,
    submit,
  };
}