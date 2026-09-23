import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { homeService } from '@/services/home/HomeService';
import { HomeDashboardData } from '@/types/home.types';

interface UseHomeDashboardState {
  data: HomeDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  respondingId: string | null;
}

export function useHomeDashboard() {
  const [state, setState] = useState<UseHomeDashboardState>({
    data: null,
    isLoading: true,
    errorMessage: null,
    respondingId: null,
  });

  const isFetchingRef = useRef(false);
  const lastFetchedTimeRef = useRef(0);

  const loadDashboard = useCallback(async (isSilent = false, force = false) => {
    const now = Date.now();
    if (isFetchingRef.current) return;

    if (!force && isSilent && now - lastFetchedTimeRef.current < 2000) {
      return;
    }

    isFetchingRef.current = true;
    if (!isSilent) {
      setState((prev) => ({ ...prev, isLoading: prev.data === null, errorMessage: null }));
    }

    try {
      const response: any = await homeService.getHomeDashboard();
      const rawData = response?.data || response;

      if (rawData) {
        const summary = rawData.attendanceSummary || rawData.stats || {};
        rawData.attendanceSummary = {
          presentCount: Number(summary.presentCount ?? 0),
          absentCount: Number(summary.absentCount ?? 0),
          totalStudents: Number(summary.totalStudents ?? 0),
        };
      }

      lastFetchedTimeRef.current = Date.now();
      setState({ data: rawData, isLoading: false, errorMessage: null, respondingId: null });
    } catch (err: any) {
      const isRateLimit = err?.response?.status === 429;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: isRateLimit
          ? 'درخواستوں کی حد ختم ہو گئی۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔'
          : prev.data
          ? null
          : 'ڈیش بورڈ لوڈ نہیں ہو سکا',
        respondingId: null,
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard(true, false);
    }, [loadDashboard])
  );

  const respondToLeaveRequest = useCallback(
    async (requestId: string, approve: boolean) => {
      setState((prev) => ({ ...prev, respondingId: requestId }));

      const success = await homeService.respondToLeaveRequest(requestId, approve);

      if (!success) {
        setState((prev) => ({ ...prev, respondingId: null }));
        return;
      }

      setState((prev) => {
        if (!prev.data) return { ...prev, respondingId: null };

        return {
          ...prev,
          respondingId: null,
          data: {
            ...prev.data,
            leaveRequests: (prev.data.leaveRequests || []).filter(
              (request) => request.id !== requestId
            ),
          },
        };
      });
    },
    []
  );

  return { ...state, reload: loadDashboard, respondToLeaveRequest };
}