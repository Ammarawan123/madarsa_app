import {
  ParentDashboardData,
  ParentRoznamaRecord,
  PerformanceHistoryItem,
} from '@/types/parent.types';

export interface IParentStrategy {
  getDashboardData(studentId?: string): Promise<ParentDashboardData>;
  getParentRoznama(studentId: string): Promise<ParentRoznamaRecord | null>;
  submitParentRoznama(record: ParentRoznamaRecord): Promise<boolean>;
  getPerformanceHistory(studentId: string): Promise<PerformanceHistoryItem[]>;
}
