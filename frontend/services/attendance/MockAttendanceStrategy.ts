import { IAttendanceStrategy } from './IAttendanceStrategy';
import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

const MOCK_TODAY_LIST: StudentAttendanceItem[] = [
  { id: 'st1', name: 'عبداللہ احمد', grade: 'حفظ', rollNumber: '۸', status: null },
  { id: 'st2', name: 'محمد علی', grade: 'حفظ', rollNumber: '۹', status: null },
  { id: 'st3', name: 'محمد حسین', grade: 'حفظ', rollNumber: '۱۰', status: null },
  { id: 'st4', name: 'محمد عمر', grade: 'حفظ', rollNumber: '۱۱', status: null },
  { id: 'st5', name: 'محمد حسین', grade: 'ناظرہ', rollNumber: '۱۲', status: null },
];

const MOCK_HISTORY_LIST: AttendanceHistoryItem[] = [
  { id: 'st1', name: 'عبداللہ احمد', grade: 'حفظ', rollNumber: '۸', badgeLabel: 'عارضی', badgeType: 'leave' },
  { id: 'st2', name: 'محمد علی', grade: 'حفظ', rollNumber: '۹', badgeLabel: 'عارضی', badgeType: 'leave' },
  { id: 'st3', name: 'محمد حسین', grade: 'حفظ', rollNumber: '۱۰', badgeLabel: 'رخصت', badgeType: 'leave' },
  { id: 'st4', name: 'محمد عمر', grade: 'حفظ', rollNumber: '۱۱', badgeLabel: 'حاضر', badgeType: 'present' },
  { id: 'st5', name: 'محمد سعد', grade: 'حفظ', rollNumber: '۱۲', badgeLabel: 'حاضر', badgeType: 'present' },
  { id: 'st6', name: 'محمد طلحہ', grade: 'ناظرہ', rollNumber: '۱۳', badgeLabel: 'حاضر', badgeType: 'present' },
  { id: 'st7', name: 'محمد عثمان', grade: 'ناظرہ', rollNumber: '۱۴', badgeLabel: 'حاضر', badgeType: 'present' },
];

const MOCK_HISTORY_DETAIL: StudentHistoryDetail = {
  studentName: 'عبداللہ احمد',
  grade: 'حفظ',
  rollNumber: '۸',
  monthLabel: 'جون ۲۰۲۶',
  entries: [
    { id: 'd1', dateLabel: 'پیر، ۲ جون ۲۰۲۶', status: 'present' },
    { id: 'd2', dateLabel: 'منگل، ۳ جون ۲۰۲۶', status: 'present' },
    { id: 'd3', dateLabel: 'بدھ، ۴ جون ۲۰۲۶', status: 'present' },
    { id: 'd4', dateLabel: 'جمعرات، ۵ جون ۲۰۲۶', status: 'leave' },
    { id: 'd5', dateLabel: 'جمعہ، ۶ جون ۲۰۲۶', status: 'leave' },
    { id: 'd6', dateLabel: 'ہفتہ، ۷ جون ۲۰۲۶', status: 'absent' },
    { id: 'd7', dateLabel: 'اتوار، ۸ جون ۲۰۲۶', status: 'absent' },
  ],
};

export class MockAttendanceStrategy implements IAttendanceStrategy {
  async getTodayAttendanceList(_classId: string): Promise<StudentAttendanceItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_TODAY_LIST.map((student) => ({ ...student }));
  }

  async submitAttendance(_records: StudentAttendanceItem[]): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return true;
  }

  async getAttendanceHistoryList(_classId: string): Promise<AttendanceHistoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_HISTORY_LIST;
  }

  async getStudentHistoryDetail(_studentId: string): Promise<StudentHistoryDetail> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_HISTORY_DETAIL;
  }
}