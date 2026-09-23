import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

export interface IAttendanceStrategy {
  getTodayAttendanceList(classId: string): Promise<StudentAttendanceItem[]>;
  submitAttendance(records: StudentAttendanceItem[]): Promise<boolean>;
  getAttendanceHistoryList(classId: string, month?: number): Promise<AttendanceHistoryItem[]>; // <-- Updated
  getStudentHistoryDetail(studentId: string): Promise<StudentHistoryDetail>;
}