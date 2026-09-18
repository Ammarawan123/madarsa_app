import { useCallback, useEffect } from 'react';
import { useParentStore } from '@/store/useParentStore';

export function useParentDashboard() {
  const {
    dashboardData,
    isSubmittedToday,
    isLoading,
    errorMessage,
    loadDashboard,
  } = useParentStore();

  useEffect(() => {
    if (!dashboardData) {
      loadDashboard();
    }
  }, [dashboardData, loadDashboard]);

  const refreshDashboard = useCallback(async () => {
    await loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    student: dashboardData?.student,
    isSubmittedToday,
    performanceHistory: dashboardData?.performanceHistory || [],
    isLoading,
    errorMessage,
    refreshDashboard,
  };
}
