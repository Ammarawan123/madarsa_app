import { useState, useEffect, useCallback } from 'react';
import { homeService } from '@/services/home/HomeService';
import { HomeDashboardData } from '@/types/home.types';

interface UseHomeDashboardState {
  data: HomeDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  respondingId: string | null;
}

export function useHomeDashboard(qariId: string = 'qari-001') {
  const [state, setState] = useState<UseHomeDashboardState>({
    data: null,
    isLoading: true,
    errorMessage: null,
    respondingId: null,
  });

  const loadDashboard = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: null }));

    try {
      const data = await homeService.getHomeDashboard(qariId);
      setState({ data, isLoading: false, errorMessage: null, respondingId: null });
    } catch {
      setState({
        data: null,
        isLoading: false,
        errorMessage: 'ڈیش بورڈ لوڈ نہیں ہو سکا',
        respondingId: null,
      });
    }
  }, [qariId]);

  const respondToLeaveRequest = useCallback(
    async (requestId: string, approve: boolean) => {
      setState((prev) => ({ ...prev, respondingId: requestId }));

      const success = await homeService.respondToLeaveRequest(requestId, approve);

      // Early return — request fail ho jaye to list waisi hi rehne dein
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
            leaveRequests: prev.data.leaveRequests.filter((request) => request.id !== requestId),
          },
        };
      });
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { ...state, reload: loadDashboard, respondToLeaveRequest };
}