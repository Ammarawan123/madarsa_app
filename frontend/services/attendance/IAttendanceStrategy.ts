import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

export interface IAttendanceStrategy {
  getTodayAttendanceList(classId: string): Promise<StudentAttendanceItem[]>;
  submitAttendance(records: StudentAttendanceItem[]): Promise<boolean>;
  getAttendanceHistoryList(classId: string): Promise<AttendanceHistoryItem[]>;
  getStudentHistoryDetail(studentId: string): Promise<StudentHistoryDetail>;
}