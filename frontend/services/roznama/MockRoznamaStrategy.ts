import { IRoznamaStrategy } from './IRoznamaStrategy';
import {
  DailyReport,
  RoznamaRecord,
  Student,
  StudentType,
} from '@/types/roznama.types';

// Mock students data matching Screenshots
const INITIAL_STUDENTS: Student[] = [
  // Nazra Students
  {
    id: 'st-1',
    name: 'محمد احمد',
    rollNumber: '۱',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'pending',
  },
  {
    id: 'st-2',
    name: 'محمد علی',
    rollNumber: '۲',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'pending',
  },
  {
    id: 'st-3',
    name: 'محمد حسن',
    rollNumber: '۳',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'pending',
  },
  {
    id: 'st-4',
    name: 'محمد عبداللہ',
    rollNumber: '۴',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-5',
    name: 'محمد حمزہ',
    rollNumber: '۵',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-6',
    name: 'سلمان قریشی',
    rollNumber: '۶',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'draft',
  },
  {
    id: 'st-7',
    name: 'محمد عثمان',
    rollNumber: '۷',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-8',
    name: 'فاطمہ خان',
    rollNumber: '۴',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'pending',
  },
  {
    id: 'st-9',
    name: 'حسن نواز',
    rollNumber: '۸',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-10',
    name: 'علی رضا',
    rollNumber: '۹',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-11',
    name: 'زینب اسلم',
    rollNumber: '۱۰',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },
  {
    id: 'st-12',
    name: 'عائشہ مہر',
    rollNumber: '۱۱',
    classType: 'nazra',
    studentType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
  },

  // Hifz Students matching Screenshot 1 & 2
  {
    id: 'st-h1',
    name: 'فاطمہ خان',
    rollNumber: '۴',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'pending',
  },
  {
    id: 'st-h2',
    name: 'عبداللہ احمد',
    rollNumber: '۱',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'pending',
  },
  {
    id: 'st-h3',
    name: 'ابوبکر صدیق',
    rollNumber: '۲',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'draft',
  },
  {
    id: 'st-h4',
    name: 'عمر فاروق',
    rollNumber: '۳',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'completed',
  },
  {
    id: 'st-h5',
    name: 'بلال حیدر',
    rollNumber: '۵',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'pending',
  },
  {
    id: 'st-h6',
    name: 'طلحہ زبیر',
    rollNumber: '۶',
    classType: 'hifz',
    studentType: 'hifz',
    className: 'حفظ',
    status: 'completed',
  },
];

// Pre-filled records matching UI screenshots
const INITIAL_RECORDS: Record<string, RoznamaRecord> = {
  // Hifz Record for Fatima Khan matching Image 2, 3, 4
  'st-h1': {
    studentId: 'st-h1',
    studentName: 'فاطمہ خان',
    rollNumber: '۴',
    studentType: 'hifz',
    classType: 'hifz',
    className: 'حفظ',
    status: 'pending',
    isParaComplete: true,
    completedParaNumber: '۱ الم',
    hasSabaq: true,
    sabaqFrom: 'سورۃ البقرہ، آیت ۵',
    sabaqTo: 'سورۃ البقرہ، آیت ۱۲',
    hasSabqi: false,
    sabqiMistakes: 5,
    hasManzil: true,
    manzilEntries: [
      {
        id: 'manzil-1',
        paraNumber: 12,
        paraName: 'وَمَا مِنْ دَابَّةٍ',
        portion: 'ربع',
        mistakes: 5,
        recitedTo: 'student',
        listenerStudentName: 'احمد',
      },
    ],
    teacherOpinion: 'اے - ون',
    updatedAt: new Date().toISOString(),
  },

  // Completed Nazra Record for Muhammad Abdullah
  'st-4': {
    studentId: 'st-4',
    studentName: 'محمد عبداللہ',
    rollNumber: '۴',
    studentType: 'nazra',
    classType: 'nazra',
    className: 'ناظرہ',
    status: 'completed',
    hasSabaq: true,
    lessonStage: 'qaeda',
    boardNumber: 5,
    hasSabqi: true,
    sabqiMistakes: 2,
    teacherOpinion: 'بہترین کارکردگی',
    updatedAt: new Date().toISOString(),
  },

  // Completed Hifz Record for Umar Farooq
  'st-h4': {
    studentId: 'st-h4',
    studentName: 'عمر فاروق',
    rollNumber: '۳',
    studentType: 'hifz',
    classType: 'hifz',
    className: 'حفظ',
    status: 'completed',
    isParaComplete: true,
    completedParaNumber: '۱۵ سُبْحَانَ الَّذِي',
    hasSabaq: true,
    sabaqFrom: 'سورۃ الإسراء، آیت ۱',
    sabaqTo: 'سورۃ الإسراء، آیت ۱۰',
    hasSabqi: true,
    sabqiMistakes: 0,
    hasManzil: true,
    manzilEntries: [
      {
        id: 'manzil-2',
        paraNumber: 14,
        paraName: 'رُبَمَا',
        portion: 'نصف',
        mistakes: 1,
        recitedTo: 'qari',
      },
    ],
    teacherOpinion: 'ماشاءاللہ، عمدہ کارکردگی',
    updatedAt: new Date().toISOString(),
  },
};

export class MockRoznamaStrategy implements IRoznamaStrategy {
  private students: Student[] = [...INITIAL_STUDENTS];
  private records: Record<string, RoznamaRecord> = { ...INITIAL_RECORDS };

  async getStudents(classType?: StudentType): Promise<Student[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!classType) return [...this.students];
    return this.students.filter(
      (s) => s.studentType === classType || s.classType === classType
    );
  }

  async getStudentRoznama(studentId: string): Promise<RoznamaRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const record = this.records[studentId];
    if (record) return { ...record };

    const student = this.students.find((s) => s.id === studentId);
    if (!student) return null;

    const isHifz = student.studentType === 'hifz' || student.classType === 'hifz';

    return {
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      studentType: isHifz ? 'hifz' : 'nazra',
      classType: isHifz ? 'hifz' : 'nazra',
      className: student.className,
      status: student.status,
      hasSabaq: false,
      lessonStage: isHifz ? null : 'qaeda',
      boardNumber: isHifz ? null : 5,
      sabaqFrom: isHifz ? 'سورۃ البقرہ، آیت ۵' : '',
      sabaqTo: isHifz ? 'سورۃ البقرہ، آیت ۱۲' : '',
      hasSabqi: false,
      sabqiMistakes: 5,
      isParaComplete: false,
      completedParaNumber: isHifz ? '۱ الم' : null,
      hasManzil: false,
      manzilEntries: [],
      teacherOpinion: 'اے - ون',
    };
  }

  async saveRoznama(record: RoznamaRecord): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const updatedRecord: RoznamaRecord = {
      ...record,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    };
    this.records[record.studentId] = updatedRecord;

    this.students = this.students.map((s) =>
      s.id === record.studentId ? { ...s, status: 'completed' } : s
    );

    return true;
  }

  async updateRoznama(record: RoznamaRecord): Promise<boolean> {
    return this.saveRoznama(record);
  }

  async submitAllRoznamas(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.students = this.students.map((s) => ({
      ...s,
      status: 'completed',
    }));
    return true;
  }

  // Backwards compatibility for legacy components
  async getReport(studentId: string): Promise<DailyReport> {
    const student = this.students.find((s) => s.id === studentId);
    const record = this.records[studentId];

    return {
      type: student?.studentType === 'hifz' ? 'hifz' : 'nazira',
      studentId,
      studentName: student?.name ?? 'فاطمہ خان',
      grade: student?.className ?? 'ناظرہ',
      rollNumber: student?.rollNumber ?? '۴',
      status: (record?.status === 'completed' ? 'completed' : 'pending') as
        | 'completed'
        | 'pending',
      reciterType: 'qari',
      reciterStudentName: null,
      paraComplete: !!record?.isParaComplete,
      sabaqRecited: !!record?.hasSabaq,
      sabqiRecited: !!record?.hasSabqi,
      sabqiMistakes: Number(record?.sabqiMistakes) || null,
      manzilRecited: !!record?.hasManzil,
      manzilMistakes: null,
      lessonRecited: !!record?.hasSabaq,
      lessonStage: (record?.lessonStage as any) ?? 'qaeda',
      boardNumber: Number(record?.boardNumber) || 5,
      teacherOpinion: record?.teacherOpinion ?? 'اے - ون',
    };
  }

  async submitReport(report: DailyReport): Promise<boolean> {
    const studentId = report.studentId;
    this.students = this.students.map((s) =>
      s.id === studentId ? { ...s, status: 'completed' } : s
    );
    return true;
  }

  async revertReport(studentId: string): Promise<boolean> {
    this.students = this.students.map((s) =>
      s.id === studentId ? { ...s, status: 'pending' } : s
    );
    return true;
  }
}