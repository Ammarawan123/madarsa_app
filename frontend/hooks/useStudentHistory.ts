import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services/attendance/AttendanceService';
import { StudentHistoryDetail } from '@/types/attendance-marking.types';

export function useStudentHistory(studentId: string) {
  const [detail, setDetail] = useState<StudentHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await attendanceService.getStudentHistoryDetail(studentId);
      setDetail(data);
    } catch {
      setErrorMessage('تفصیل لوڈ نہیں ہو سکی');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return { detail, isLoading, errorMessage };
}