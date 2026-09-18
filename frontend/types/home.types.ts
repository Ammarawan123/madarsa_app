export type LeaveStatus = 'under_review' | 'approved' | 'rejected';

export interface QariProfile {
  name: string;
  role: string;
  hasUnreadNotifications: boolean;
  hasUnreadMessages: boolean;
}

export interface ClassSummary {
  className: string;
  gregorianDate: string;
  hijriDate: string;
}

export interface AttendanceSummary {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

export interface LeaveRequest {
  id: string;
  studentName: string;
  grade: string;
  status: LeaveStatus;
  typeLabel: string;
  reason: string;
  durationLabel: string;
  timeAgoLabel: string;   // naya field
}

export interface HomeDashboardData {
  profile: QariProfile;
  classSummary: ClassSummary;
  attendanceSummary: AttendanceSummary;
  leaveRequests: LeaveRequest[];
}