import api from '../api';
import { IAttendanceStrategy } from './IAttendanceStrategy';
import {
  StudentAttendanceItem,
  AttendanceHistoryItem,
  StudentHistoryDetail,
} from '@/types/attendance-marking.types';

export class ApiAttendanceStrategy implements IAttendanceStrategy {
  async getTodayAttendanceList(classId: string): Promise<StudentAttendanceItem[]> {
    try {
      const response = await api.get(`/attendance/students-list`, {
        params: { classId },
      });
      const rawList = response.data?.data || response.data || [];

      return rawList.map((item: any) => ({
        id: String(item.id),
        name: item.fullName || item.name || item.full_name || '',
        grade: item.trackType || item.grade || item.track_type || '',
        rollNumber: item.rollNumber || item.roll_number || '',
        // Backend DB se milne wala status
        status: item.status ? item.status.toLowerCase() : null,
      }));
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      return [];
    }
  }

  async submitAttendance(records: StudentAttendanceItem[]): Promise<boolean> {
    try {
      const payload = records.map((r) => ({
        studentId: Number(r.id),
        status: (r.status || 'ABSENT').toUpperCase(),
        remarks: null,
      }));

      const response = await api.post('/attendance/mark-bulk', payload);
      return response.data?.success || response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error submitting attendance:', error);
      throw error;
    }
  }

  async getAttendanceHistoryList(classId: string, month?: number): Promise<AttendanceHistoryItem[]> {
    try {
      const params: any = { classId };
      if (month) {
        params.month = month;
        params.year = new Date().getFullYear();
      }

      const response = await api.get(`/attendance/class-history`, { params });
      const rawList = response.data?.data || response.data || [];

      return rawList.map((item: any) => ({
        id: String(item.id || item.studentId),
        name: item.student?.fullName || item.name || '',
        grade: item.student?.trackType || item.grade || '',
        rollNumber: item.student?.rollNumber || item.rollNumber || '',
        badgeLabel: item.statusUrdu || item.badgeLabel || item.status || '',
        badgeType: this.mapStatusToBadge(item.status || item.badgeType),
      }));
    } catch (error) {
      console.error('Error fetching class history:', error);
      return [];
    }
  }

  async getStudentHistoryDetail(studentId: string): Promise<StudentHistoryDetail> {
    try {
      const endpoint = `/attendance/student/${studentId}/history`;
      const response = await api.get(endpoint);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching student history detail:', error);
      throw error;
    }
  }

  private mapStatusToBadge(status: string): 'present' | 'absent' | 'leave' | 'pending' {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'present';
      case 'ABSENT':
        return 'absent';
      case 'LEAVE':
        return 'leave';
      default:
        return 'pending';
    }
  }
}