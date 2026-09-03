export interface ParentPrayers {
  fajr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface ParentScreenTime {
  hours: number;
  minutes: number;
}

export interface ParentRoznamaRecord {
  id: string;
  studentId: string;
  submissionDate: string; // e.g. "بدھ ، ۳ جون ۲۰۲۶"
  homeArrivalTime: string; // e.g. "۱۲:۰۵ شام"
  prayers: ParentPrayers;
  screenTime: ParentScreenTime;
  parentRemarks: string;
  isSubmitted: boolean;
}

export interface PerformanceHistoryItem {
  id: string;
  dateUrdu: string; // e.g. "پیر ، ۱ اگست ۲۰۲۶"
  gregorianDate: string;
  isSubmitted: boolean;
}

export interface ParentStudentInfo {
  id: string;
  name: string; // "عبداللہ احمد"
  rollNumber: string; // "۱۲"
  status: 'present' | 'absent' | 'leave'; // "حاضر"
  qariName: string; // "محمد عثمان"
  className: string; // "الف(حفظ)"
  gregorianDate: string; // "بدھ، ۳ جون ۲۰۲۶"
  hijriDate: string; // "۲ ذو الحجہ، ۱۴۲۷ھ"
  completedParas: number; // 25
  totalParas: number; // 30
  currentParaNumber: number; // 16
  currentParaName: string; // "قَال أَلَمْ"
}

export interface ParentDashboardData {
  student: ParentStudentInfo;
  isRoznamaSubmittedToday: boolean;
  todayRecord?: ParentRoznamaRecord | null;
  performanceHistory: PerformanceHistoryItem[];
}
