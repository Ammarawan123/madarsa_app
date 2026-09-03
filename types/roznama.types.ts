export type ReciterType = 'student' | 'qari';
export type RoznamaStatus = 'pending' | 'draft' | 'completed';
export type ReportStatus = 'pending' | 'completed';
export type LessonStage = 'qaeda' | 'sabaq';
export type StudentType = 'nazra' | 'hifz';
export type StudentClassType = StudentType; // alias for backwards compatibility

export interface ManzilEntry {
  id: string;
  paraNumber: number;
  paraName: string;
  portion: string; // e.g., 'ربع', 'نصف', 'پون', 'پورا پارہ'
  mistakes: number;
  recitedTo: 'qari' | 'student';
  listenerStudentName?: string; // Required if recitedTo === 'student'
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classType: StudentType;
  studentType: StudentType;
  className: string;
  status: RoznamaStatus;
}

export interface RoznamaRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  studentType: StudentType;
  classType?: StudentType;
  className: string;
  status: RoznamaStatus;

  // Common Sabaq fields
  hasSabaq: boolean;
  sabaqRecited?: boolean; // legacy alias

  // Nazra Sabaq fields
  lessonStage?: LessonStage | null;
  boardNumber?: number | string | null;

  // Hifz Sabaq fields
  sabaqFrom?: string; // e.g. "سورۃ البقرہ، آیت ۵"
  sabaqTo?: string; // e.g. "سورۃ البقرہ، آیت ۱۲"

  // Sabqi fields
  hasSabqi: boolean;
  sabqiRecited?: boolean; // legacy alias
  sabqiMistakes?: number | string | null;

  // Hifz Specific fields
  isParaComplete?: boolean;
  paraComplete?: boolean; // legacy alias
  completedParaNumber?: number | string | null; // e.g. "۱ الم"
  paraNumber?: number | string | null;

  hasManzil?: boolean;
  manzilRecited?: boolean; // legacy alias
  manzilMistakes?: number | string | null;
  manzilEntries?: ManzilEntry[];

  // Teacher Evaluation
  teacherOpinion: string;
  updatedAt?: string;
}

// 30 Quran Paras with Urdu/Arabic titles
export const QURAN_PARAS: { number: number; name: string }[] = [
  { number: 1, name: 'الم' },
  { number: 2, name: 'سَیَقُولُ' },
  { number: 3, name: 'تِلْكَ الرُّسُلُ' },
  { number: 4, name: 'لَنْ تَنَالُوا' },
  { number: 5, name: 'وَالْمُحْصَنَاتُ' },
  { number: 6, name: 'لَا يُحِبُّ اللَّهُ' },
  { number: 7, name: 'وَإِذَا سَمِعُوا' },
  { number: 8, name: 'وَلَوْ أَنَّنَا' },
  { number: 9, name: 'قَالَ الْمَلَأُ' },
  { number: 10, name: 'وَاعْلَمُوا' },
  { number: 11, name: 'يَعْتَذِرُونَ' },
  { number: 12, name: 'وَمَا مِنْ دَابَّةٍ' },
  { number: 13, name: 'وَمَا أُبَرِّئُ' },
  { number: 14, name: 'رُبَمَا' },
  { number: 15, name: 'سُبْحَانَ الَّذِي' },
  { number: 16, name: 'قَالَ أَلَمْ' },
  { number: 17, name: 'اقْتَرَبَ' },
  { number: 18, name: 'قَدْ أَفْلَحَ' },
  { number: 19, name: 'وَقَالَ الَّذِينَ' },
  { number: 20, name: 'أَمَّنْ خَلَقَ' },
  { number: 21, name: 'اتْلُ مَا أُوحِيَ' },
  { number: 22, name: 'وَمَنْ يَقْنُتْ' },
  { number: 23, name: 'وَمَا لِيَ' },
  { number: 24, name: 'فَمَنْ أَظْلَمُ' },
  { number: 25, name: 'إِلَيْهِ يُرَدُّ' },
  { number: 26, name: 'حم' },
  { number: 27, name: 'قَالَ فَمَا خَطْبُكُمْ' },
  { number: 28, name: 'قَدْ سَمِعَ اللَّهُ' },
  { number: 29, name: 'تَبَارَكَ الَّذِي' },
  { number: 30, name: 'عَمَّ' },
];

export const MANZIL_PORTIONS: string[] = ['ربع', 'نصف', 'پون', 'پورا پارہ'];

// Retain DailyReport types for backwards-compatibility
export interface BaseDailyReport {
  studentId: string;
  studentName: string;
  grade: string;
  rollNumber: string;
  status: ReportStatus;
  reciterType: ReciterType;
  reciterStudentName: string | null;
  teacherOpinion: string;
}

export interface HifzDailyReport extends BaseDailyReport {
  type: 'hifz';
  paraComplete: boolean;
  sabaqRecited: boolean;
  sabqiRecited: boolean;
  sabqiMistakes: number | null;
  manzilRecited: boolean;
  manzilMistakes: number | null;
}

export interface NaziraDailyReport extends BaseDailyReport {
  type: 'nazira';
  lessonRecited: boolean;
  lessonStage: LessonStage | null;
  boardNumber: number | null;
  sabqiRecited: boolean;
  sabqiMistakes: number | null;
}

export type DailyReport = HifzDailyReport | NaziraDailyReport;
export type DailyReportField = keyof HifzDailyReport | keyof NaziraDailyReport;
export type DailyReportValue<K extends DailyReportField> =
  K extends keyof HifzDailyReport
    ? K extends keyof NaziraDailyReport
      ? HifzDailyReport[K] | NaziraDailyReport[K]
      : HifzDailyReport[K]
    : K extends keyof NaziraDailyReport
      ? NaziraDailyReport[K]
      : never;
