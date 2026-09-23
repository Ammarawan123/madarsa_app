import api from '../api';
import { IParentStrategy } from './IParentStrategy';
import {
  ParentDashboardData,
  ParentRoznamaRecord,
  PerformanceHistoryItem,
} from '@/types/parent.types';

export class ApiParentStrategy implements IParentStrategy {
  async getDashboardData(studentId?: string): Promise<ParentDashboardData> {
    const response = await api.get('/parent/student-summary', {
      params: { studentId },
    });
    return response.data?.data || response.data;
  }

  async getParentRoznama(studentId: string): Promise<ParentRoznamaRecord | null> {
    const response = await api.get(`/parent/roznama/${studentId}`);
    return response.data?.data || response.data || null;
  }

  async submitParentRoznama(record: ParentRoznamaRecord): Promise<boolean> {
    const response = await api.post('/parent/roznama', record);
    return response.status === 200 || response.status === 201;
  }

  async getPerformanceHistory(studentId: string): Promise<PerformanceHistoryItem[]> {
    const response = await api.get(`/parent/performance-history/${studentId}`);
    return response.data?.data || response.data || [];
  }
}