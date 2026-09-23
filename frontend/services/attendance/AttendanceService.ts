import { IAttendanceStrategy } from './IAttendanceStrategy';
import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

class AttendanceService {
  private static instance: AttendanceService;
  private strategy?: IAttendanceStrategy;

  private constructor() {}

  static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  setStrategy(strategy: IAttendanceStrategy): void {
    this.strategy = strategy;
  }

  private getStrategy(): IAttendanceStrategy {
    if (!this.strategy) {
      throw new Error('Attendance strategy layer set nahi hui hai.');
    }
    return this.strategy;
  }

  getTodayAttendanceList(classId: string): Promise<StudentAttendanceItem[]> {
    return this.getStrategy().getTodayAttendanceList(classId);
  }

  submitAttendance(records: StudentAttendanceItem[]): Promise<boolean> {
    return this.getStrategy().submitAttendance(records);
  }

  // UPDATE: month parameter add kar diya gaya hai
  getAttendanceHistoryList(classId: string, month?: number): Promise<AttendanceHistoryItem[]> {
    return this.getStrategy().getAttendanceHistoryList(classId, month);
  }

  getStudentHistoryDetail(studentId: string): Promise<StudentHistoryDetail> {
    return this.getStrategy().getStudentHistoryDetail(studentId);
  }

}

export const attendanceService = AttendanceService.getInstance();