import { IRoznamaStrategy } from './IRoznamaStrategy';
import { MockRoznamaStrategy } from './MockRoznamaStrategy';
import {
  DailyReport,
  RoznamaRecord,
  Student,
  StudentType,
} from '@/types/roznama.types';

export class RoznamaService {
  private static instance: RoznamaService;
  private strategy: IRoznamaStrategy;

  private constructor(strategy: IRoznamaStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): RoznamaService {
    if (!RoznamaService.instance) {
      RoznamaService.instance = new RoznamaService(new MockRoznamaStrategy());
    }
    return RoznamaService.instance;
  }

  setStrategy(strategy: IRoznamaStrategy): void {
    this.strategy = strategy;
  }

  getStudents(classType?: StudentType): Promise<Student[]> {
    return this.strategy.getStudents(classType);
  }

  getStudentRoznama(studentId: string): Promise<RoznamaRecord | null> {
    return this.strategy.getStudentRoznama(studentId);
  }

  saveRoznama(record: RoznamaRecord): Promise<boolean> {
    return this.strategy.saveRoznama(record);
  }

  updateRoznama(record: RoznamaRecord): Promise<boolean> {
    return this.strategy.updateRoznama(record);
  }

  submitAllRoznamas(): Promise<boolean> {
    if (this.strategy.submitAllRoznamas) {
      return this.strategy.submitAllRoznamas();
    }
    return Promise.resolve(true);
  }

  getReport(studentId: string): Promise<DailyReport> {
    if (this.strategy.getReport) {
      return this.strategy.getReport(studentId);
    }
    return Promise.reject(new Error('getReport not implemented'));
  }

  submitReport(report: DailyReport): Promise<boolean> {
    if (this.strategy.submitReport) {
      return this.strategy.submitReport(report);
    }
    return Promise.resolve(true);
  }

  revertReport(studentId: string): Promise<boolean> {
    if (this.strategy.revertReport) {
      return this.strategy.revertReport(studentId);
    }
    return Promise.resolve(true);
  }
}

export const roznamaService = RoznamaService.getInstance();