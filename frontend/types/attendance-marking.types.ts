export type MarkStatus = 'present' | 'absent';

export interface StudentAttendanceItem {
  id: string;
  name: string;
  grade: string;
  rollNumber: string;
  status: MarkStatus | null; // null = abhi tak mark nahi hua
}

export type HistoryBadgeType = 'leave' | 'present' | 'absent' | 'pending';

export interface AttendanceHistoryItem {
  id: string;
  name: string;
  grade: string;
  rollNumber: string;
  badgeLabel: string; // e.g. 'عارضی', 'رخصت'
  badgeType: HistoryBadgeType;
}

export interface DailyAttendanceEntry {
  id: string;
  dateLabel: string;
  status: 'present' | 'absent' | 'leave';
}


export interface StudentHistoryDetail {
  id?: string;
  name?: string;
  grade?: string;
  rollNumber?: string;
  monthName?: string;
  history?: Array<{
    id?: string;
    date?: string;
    formattedDate?: string;
    dayName?: string;
    status?: string;
    badgeType?: string;
  }>;
}