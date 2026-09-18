import { useState, useEffect, useCallback, useMemo } from 'react';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { StudentAttendanceItem, MarkStatus } from '@/types/attendance-marking.types';

export function useAttendanceMarking(classId: string = 'class-alif') {
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const list = await attendanceService.getTodayAttendanceList(classId);
      setStudents(list);
    } catch {
      setErrorMessage('فہرست لوڈ نہیں ہو سکی');
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

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
    setIsSubmitting(true);

    try {
      const success = await attendanceService.submitAttendance(students);

      // Early return — submission fail ho jaye
      if (!success) {
        setIsSubmitting(false);
        return false;
      }

      setIsSubmitting(false);
      return true;
    } catch {
      setIsSubmitting(false);
      return false;
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