import { IAttendanceStrategy } from './IAttendanceStrategy';
import { MockAttendanceStrategy } from './MockAttendanceStrategy';
import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

class AttendanceService {
  private static instance: AttendanceService;
  private strategy: IAttendanceStrategy;

  private constructor(strategy: IAttendanceStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService(new MockAttendanceStrategy());
    }
    return AttendanceService.instance;
  }

  setStrategy(strategy: IAttendanceStrategy): void {
    this.strategy = strategy;
  }

  getTodayAttendanceList(classId: string): Promise<StudentAttendanceItem[]> {
    return this.strategy.getTodayAttendanceList(classId);
  }

  submitAttendance(records: StudentAttendanceItem[]): Promise<boolean> {
    return this.strategy.submitAttendance(records);
  }

  getAttendanceHistoryList(classId: string): Promise<AttendanceHistoryItem[]> {
    return this.strategy.getAttendanceHistoryList(classId);
  }

  getStudentHistoryDetail(studentId: string): Promise<StudentHistoryDetail> {
    return this.strategy.getStudentHistoryDetail(studentId);
  }
}

export const attendanceService = AttendanceService.getInstance();