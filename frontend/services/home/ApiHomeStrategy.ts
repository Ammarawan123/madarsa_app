import api from '../api';
import { HomeDashboardData } from '@/types/home.types';
import { UrduDateFormatter } from '@/utils/formatters/UrduDateFormatter';
import { HijriDateFormatter } from '@/utils/formatters/HijriDateFormatter';

export class ApiHomeStrategy {
  async getHomeDashboard(): Promise<HomeDashboardData> {
    const response = await api.get('/teacher/dashboard');

    const data = response.data?.data || response.data;

    // Dates are always computed client-side for correct local timezone
    const now = new Date();
    const gregorianDate = UrduDateFormatter.formatDate(now);
    const hijriDate = HijriDateFormatter.formatDate(now);

    return {
      profile: {
        name: data?.profile?.name || data?.qariName || 'حافظ محمد ابراہیم',
        role: (!data?.profile?.role || data?.profile?.role === 'QARI') ? 'قاری صاحب' : data.profile.role,
        hasUnreadNotifications: Boolean(data?.profile?.hasUnreadNotifications),
        hasUnreadMessages: Boolean(data?.profile?.hasUnreadMessages),
      },
      classSummary: {
        className: data?.classSummary?.className || data?.className || 'الف',
        gregorianDate,
        hijriDate,
      },
      attendanceSummary: {
        presentCount: Number(data?.attendanceSummary?.presentCount ?? data?.presentCount ?? 0),
        absentCount: Number(data?.attendanceSummary?.absentCount ?? data?.absentCount ?? 0),
        totalStudents: Number(data?.attendanceSummary?.totalStudents ?? data?.totalStudents ?? 0),
      },
      leaveRequests: Array.isArray(data?.leaveRequests) ? data.leaveRequests : [],
    } as HomeDashboardData;
  }

  async respondToLeaveRequest(requestId: string, approve: boolean): Promise<boolean> {
    const response = await api.post(`/teacher/leave-requests/${requestId}/respond`, {
      status: approve ? 'APPROVED' : 'REJECTED',
    });
    return response.status === 200 || response.status === 201;
  }
}