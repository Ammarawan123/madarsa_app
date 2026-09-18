import { useCallback, useEffect, useMemo } from 'react';
import { useRoznamaStore, StatusFilter } from '@/store/useRoznamaStore';
import { StudentClassType } from '@/types/roznama.types';

export function useRoznamaList() {
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
    loadStudents,
    submitAllRoznamas,
  } = useRoznamaStore();

  useEffect(() => {
    if (students.length === 0) {
      loadStudents(selectedClass);
    }
  }, [loadStudents, selectedClass, students.length]);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classType === selectedClass);
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    return classStudents.filter((student) => {
      // Status filter
      if (statusFilter !== 'all' && student.status !== statusFilter) {
        return false;
      }

      // Search query filter (name or roll number)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesRoll = student.rollNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesRoll) return false;
      }

      return true;
    });
  }, [classStudents, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = classStudents.length;
    const completed = classStudents.filter((s) => s.status === 'completed').length;
    const pending = classStudents.filter((s) => s.status === 'pending').length;
    const draft = classStudents.filter((s) => s.status === 'draft').length;
    return { total, completed, pending, draft };
  }, [classStudents]);

  const handleClassChange = useCallback(
    (cls: StudentClassType) => {
      setSelectedClass(cls);
    },
    [setSelectedClass]
  );

  const handleStatusFilterChange = useCallback(
    (status: StatusFilter) => {
      setStatusFilter(status);
    },
    [setStatusFilter]
  );

  const refreshList = useCallback(async () => {
    await loadStudents(selectedClass);
  }, [loadStudents, selectedClass]);

  return {
    students: filteredStudents,
    rawStudents: classStudents,
    selectedClass,
    statusFilter,
    searchQuery,
    isLoading,
    errorMessage,
    stats,
    setSelectedClass: handleClassChange,
    setStatusFilter: handleStatusFilterChange,
    setSearchQuery,
    refreshList,
    submitAllRoznamas,
  };
}
