import { AttendanceRepository } from './attendance.repository';

export class AttendanceService {
  private repo = new AttendanceRepository();

  // 1. Qari Self-Attendance
  async markQariSelfAttendance(loggedInUserId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE', remarks?: string) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }
    return this.repo.markQariAttendance(qari.id, status, remarks);
  }

  // 2. Student Attendance Mark
  async markStudentAttendance(studentId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE', remarks?: string) {
    return this.repo.markStudentAttendance(studentId, status, remarks);
  }

  // 3. Dashboard Stats (HIFZ / NAZRA Track Type ke Mutabiq Filtered)
  async getDashboardStats(loggedInUserId: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.repo.getDailyStatsByTrack(today, qari.trackType);
  }

  // 4. Qari ke Section (HIFZ / NAZRA) ke Students ki List Fetch Karein
  async getTrackStudents(loggedInUserId: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) {
      throw new Error('QARI_NOT_FOUND');
    }

    return this.repo.getStudentsByTrack(qari.trackType);
  }

  // 5. Student History (With Role & Parent Security Check)
  async getStudentHistory(studentId: number, loggedInUserId: number, role: string) {
    if (role === 'PARENT') {
      const isMyChild = await this.repo.checkParentAccess(loggedInUserId, studentId);
      if (!isMyChild) {
        throw new Error('FORBIDDEN_NOT_YOUR_CHILD');
      }
    }
    return this.repo.getStudentAttendanceHistory(studentId);
  }
}