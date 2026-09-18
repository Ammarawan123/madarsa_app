import {
  DailyReport,
  RoznamaRecord,
  Student,
  StudentType,
} from '@/types/roznama.types';

export interface IRoznamaStrategy {
  getStudents(classType?: StudentType): Promise<Student[]>;
  getStudentRoznama(studentId: string): Promise<RoznamaRecord | null>;
  saveRoznama(record: RoznamaRecord): Promise<boolean>;
  updateRoznama(record: RoznamaRecord): Promise<boolean>;
  submitAllRoznamas?(): Promise<boolean>;

  // Backwards compatibility methods
  getReport?(studentId: string): Promise<DailyReport>;
  submitReport?(report: DailyReport): Promise<boolean>;
  revertReport?(studentId: string): Promise<boolean>;
}