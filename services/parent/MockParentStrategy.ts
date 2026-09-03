import { IParentStrategy } from './IParentStrategy';
import {
  ParentDashboardData,
  ParentRoznamaRecord,
  PerformanceHistoryItem,
} from '@/types/parent.types';

const INITIAL_DASHBOARD_DATA: ParentDashboardData = {
  student: {
    id: 'std-1',
    name: 'عبداللہ احمد',
    rollNumber: '۱۲',
    status: 'present',
    qariName: 'محمد عثمان',
    className: 'الف(حفظ)',
    gregorianDate: 'بدھ، ۳ جون ۲۰۲۶',
    hijriDate: '۲ ذو الحجہ، ۱۴۲۷ھ',
    completedParas: 25,
    totalParas: 30,
    currentParaNumber: 16,
    currentParaName: 'قَال أَلَمْ',
  },
  isRoznamaSubmittedToday: false,
  todayRecord: null,
  performanceHistory: [
    {
      id: 'ph-1',
      dateUrdu: 'پیر ، ۱ اگست ۲۰۲۶',
      gregorianDate: '2026-08-01',
      isSubmitted: true,
    },
    {
      id: 'ph-2',
      dateUrdu: 'منگل ، ۲ اگست ۲۰۲۶',
      gregorianDate: '2026-08-02',
      isSubmitted: true,
    },
    {
      id: 'ph-3',
      dateUrdu: 'بدھ ، ۳ اگست ۲۰۲۶',
      gregorianDate: '2026-08-03',
      isSubmitted: true,
    },
    {
      id: 'ph-4',
      dateUrdu: 'جمعرات ، ۴ اگست ۲۰۲۶',
      gregorianDate: '2026-08-04',
      isSubmitted: true,
    },
    {
      id: 'ph-5',
      dateUrdu: 'جمعہ ، ۵ اگست ۲۰۲۶',
      gregorianDate: '2026-08-05',
      isSubmitted: true,
    },
  ],
};

export class MockParentStrategy implements IParentStrategy {
  private dashboardData: ParentDashboardData = { ...INITIAL_DASHBOARD_DATA };
  private records: Record<string, ParentRoznamaRecord> = {};

  async getDashboardData(_studentId?: string): Promise<ParentDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      ...this.dashboardData,
      student: { ...this.dashboardData.student },
      performanceHistory: [...this.dashboardData.performanceHistory],
    };
  }

  async getParentRoznama(studentId: string): Promise<ParentRoznamaRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const record = this.records[studentId];
    if (record) return { ...record };

    // Default preloaded draft matching Image 2/3
    return {
      id: `pr-${Date.now()}`,
      studentId,
      submissionDate: 'بدھ ، ۳ جون ۲۰۲۶',
      homeArrivalTime: '۱۲:۰۵ شام',
      prayers: {
        fajr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
      screenTime: {
        hours: 2,
        minutes: 35,
      },
      parentRemarks: 'عبداللہ بہت تنگ کرتا ہے بہت شرارتی ہے',
      isSubmitted: false,
    };
  }

  async submitParentRoznama(record: ParentRoznamaRecord): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const completedRecord: ParentRoznamaRecord = {
      ...record,
      isSubmitted: true,
    };

    this.records[record.studentId] = completedRecord;

    // Update dashboard state
    this.dashboardData.isRoznamaSubmittedToday = true;
    this.dashboardData.todayRecord = completedRecord;

    // Prepend today's submitted history entry
    const newHistoryItem: PerformanceHistoryItem = {
      id: `ph-${Date.now()}`,
      dateUrdu: record.submissionDate || 'بدھ ، ۳ جون ۲۰۲۶',
      gregorianDate: new Date().toISOString().split('T')[0],
      isSubmitted: true,
    };

    // Avoid duplicate today history item
    const exists = this.dashboardData.performanceHistory.some(
      (h) => h.dateUrdu === newHistoryItem.dateUrdu
    );
    if (!exists) {
      this.dashboardData.performanceHistory = [
        newHistoryItem,
        ...this.dashboardData.performanceHistory,
      ];
    }

    return true;
  }

  async getPerformanceHistory(
    _studentId: string
  ): Promise<PerformanceHistoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.dashboardData.performanceHistory];
  }
}
