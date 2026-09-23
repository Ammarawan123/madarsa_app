import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { AttendanceHistoryItem } from '@/types/attendance-marking.types';

export function useAttendanceHistory(
  month?: number,
  classId: string = 'class-alif'
) {
  const [list, setList] = useState<AttendanceHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const loadHistory = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await attendanceService.getAttendanceHistoryList(classId, month);
      setList(data);
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      setErrorMessage(
        isRateLimit
          ? 'درخواستوں کی حد ختم ہو گئی۔ براہ کرم تھوڑی دیر بعد کوشش کریں۔'
          : 'فہرست لوڈ نہیں ہو سکی'
      );
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [classId, month]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    return list.filter((item) => item.name.includes(searchQuery.trim()));
  }, [list, searchQuery]);

  return { list: filteredList, searchQuery, setSearchQuery, isLoading, errorMessage };
}