import { IParentStrategy } from './IParentStrategy';
import { ApiParentStrategy } from './ApiParentStrategy';
import {
  ParentDashboardData,
  ParentRoznamaRecord,
  PerformanceHistoryItem,
} from '@/types/parent.types';

export class ParentService {
  private static instance: ParentService;
  private strategy: IParentStrategy;

  private constructor(strategy: IParentStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): ParentService {
    if (!ParentService.instance) {
      // Direct Live API Strategy initialize ki gayi hai
      ParentService.instance = new ParentService(new ApiParentStrategy());
    }
    return ParentService.instance;
  }

  setStrategy(strategy: IParentStrategy): void {
    this.strategy = strategy;
  }

  getDashboardData(studentId?: string): Promise<ParentDashboardData> {
    return this.strategy.getDashboardData(studentId);
  }

  getParentRoznama(studentId: string): Promise<ParentRoznamaRecord | null> {
    return this.strategy.getParentRoznama(studentId);
  }

  submitParentRoznama(record: ParentRoznamaRecord): Promise<boolean> {
    return this.strategy.submitParentRoznama(record);
  }

  getPerformanceHistory(
    studentId: string
  ): Promise<PerformanceHistoryItem[]> {
    return this.strategy.getPerformanceHistory(studentId);
  }
}

export const parentService = ParentService.getInstance();