import { useState, useEffect, useCallback, useMemo } from 'react';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { AttendanceHistoryItem } from '@/types/attendance-marking.types';

export function useAttendanceHistory(classId: string = 'class-alif') {
  const [list, setList] = useState<AttendanceHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await attendanceService.getAttendanceHistoryList(classId);
      setList(data);
    } catch {
      setErrorMessage('فہرست لوڈ نہیں ہو سکی');
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    return list.filter((item) => item.name.includes(searchQuery.trim()));
  }, [list, searchQuery]);

  return { list: filteredList, searchQuery, setSearchQuery, isLoading, errorMessage };
}