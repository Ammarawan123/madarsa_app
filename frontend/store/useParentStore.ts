import { create } from 'zustand';
import { parentService } from '@/services/parent/ParentService';
import {
  ParentDashboardData,
  ParentRoznamaRecord,
  PerformanceHistoryItem,
} from '@/types/parent.types';

interface ParentState {
  dashboardData: ParentDashboardData | null;
  currentDraft: Partial<ParentRoznamaRecord> | null;
  isSubmittedToday: boolean;
  isLoading: boolean;
  errorMessage: string | null;

  // Actions
  loadDashboard: (studentId?: string) => Promise<void>;
  updateDraft: (patch: Partial<ParentRoznamaRecord>) => void;
  clearDraft: () => void;
  submitRoznama: (record: ParentRoznamaRecord) => Promise<boolean>;
}

export const useParentStore = create<ParentState>((set, get) => ({
  dashboardData: null,
  currentDraft: null,
  isSubmittedToday: false,
  isLoading: false,
  errorMessage: null,

  loadDashboard: async (studentId?: string) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const data = await parentService.getDashboardData(studentId);
      set({
        dashboardData: data,
        isSubmittedToday: data.isRoznamaSubmittedToday,
        isLoading: false,
      });
    } catch {
      set({
        errorMessage: 'والدین کا ڈیش بورڈ لوڈ نہیں ہو سکا',
        isLoading: false,
      });
    }
  },

  updateDraft: (patch: Partial<ParentRoznamaRecord>) => {
    set((state) => ({
      currentDraft: {
        ...(state.currentDraft || {}),
        ...patch,
      },
    }));
  },

  clearDraft: () => {
    set({ currentDraft: null });
  },

  submitRoznama: async (record: ParentRoznamaRecord) => {
    try {
      const success = await parentService.submitParentRoznama(record);
      if (!success) return false;

      const currentDashboard = get().dashboardData;
      const newHistoryItem: PerformanceHistoryItem = {
        id: `ph-${Date.now()}`,
        dateUrdu: record.submissionDate || 'بدھ ، ۳ جون ۲۰۲۶',
        gregorianDate: new Date().toISOString().split('T')[0],
        isSubmitted: true,
      };

      const updatedHistory = currentDashboard
        ? [
            newHistoryItem,
            ...currentDashboard.performanceHistory.filter(
              (h) => h.dateUrdu !== newHistoryItem.dateUrdu
            ),
          ]
        : [newHistoryItem];

      set({
        isSubmittedToday: true,
        currentDraft: null,
        dashboardData: currentDashboard
          ? {
              ...currentDashboard,
              isRoznamaSubmittedToday: true,
              todayRecord: record,
              performanceHistory: updatedHistory,
            }
          : null,
      });

      return true;
    } catch {
      return false;
    }
  },
}));
