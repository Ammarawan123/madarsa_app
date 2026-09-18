import { IHomeStrategy } from './IHomeStrategy';
import { HomeDashboardData, LeaveRequest } from '@/types/home.types';
import { UrduDateFormatter } from '@/utils/formatters/UrduDateFormatter';
import { HijriDateFormatter } from '@/utils/formatters/HijriDateFormatter';

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    studentName: 'محمد عبداللہ',
    grade: 'حفظ',
    status: 'under_review',
    typeLabel: 'عارضی',
    reason: 'شدید بخار اور نزلہ کی وجہ سے مدرسہ حاضر ہونے سے قاصر ہوں۔ برائے مہربانی تین دن کی رخصت عنایت فرمائیں۔',
    durationLabel: '۳ دن',
    timeAgoLabel: '۲ گھنٹے پہلے',
  },
];

export class MockHomeStrategy implements IHomeStrategy {
  async getHomeDashboard(_qariId: string): Promise<HomeDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const now = new Date();

    return {
      profile: {
        name: 'حافظ محمد ابراہیم',
        role: 'قاری صاحب',
        hasUnreadNotifications: true,
        hasUnreadMessages: false,
      },
      classSummary: {
        className: 'الف',
        gregorianDate: UrduDateFormatter.formatDate(now),
        hijriDate: HijriDateFormatter.formatDate(now),
      },
      attendanceSummary: {
        totalStudents: 25,
        presentCount: 3,
        absentCount: 22,
      },
      leaveRequests: MOCK_LEAVE_REQUESTS,
    };
  }

  async respondToLeaveRequest(_requestId: string, _approve: boolean): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return true;
  }
}