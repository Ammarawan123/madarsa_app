import { AttendanceRepository } from './attendance.repository';
import { getFormattedAttendanceDateUrdu } from '../../utils/date-formatter';

export class AttendanceService {
  private repo = new AttendanceRepository();

  // 1. Qari Self-Attendance
  async markQariSelfAttendance(
    loggedInUserId: number,
    status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE',
    remarks?: string
  ) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }
    return this.repo.markQariAttendance(qari.id, status, remarks);
  }

  // 2. Student Attendance Mark
  async markStudentAttendance(
    studentId: number,
    status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE',
    remarks?: string
  ) {
    return this.repo.markStudentAttendance(studentId, status, remarks);
  }

  // 3. Dashboard Stats (With Urdu Date Metadata)
  async getDashboardStats(loggedInUserId: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await this.repo.getDailyStatsByTrack(today, qari.trackType);
    const dateInfo = getFormattedAttendanceDateUrdu(today);

    return {
      dateInfo, // Urdu Gregorian, Hijri, aur Day Name ka output
      stats,
    };
  }

  // 4. Qari ke Section (HIFZ / NAZRA) ke Students ki List Fetch Karein
  async getTrackStudents(loggedInUserId: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }

    return this.repo.getStudentsByTrack(qari.trackType);
  }

  // 5. Student History (With Urdu Formatted Dates in Records)
  async getStudentHistory(
    studentId: number,
    loggedInUserId: number,
    role: string
  ) {
    if (role === 'PARENT') {
      const isMyChild = await this.repo.checkParentAccess(
        loggedInUserId,
        studentId
      );
      if (!isMyChild) {
        throw new Error('FORBIDDEN_NOT_YOUR_CHILD');
      }
    }

    const historyRecords = await this.repo.getStudentAttendanceHistory(studentId);

    // Formatted Urdu dates har history record ke saath attach karein
    return historyRecords.map((record: any) => ({
      ...record,
      dateInfo: getFormattedAttendanceDateUrdu(record.created_at || record.date),
    }));
  }
}