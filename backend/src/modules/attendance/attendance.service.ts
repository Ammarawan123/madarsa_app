import { AttendanceRepository } from './attendance.repository';
import { getFormattedAttendanceDateUrdu } from '../../utils/date-formatter';
import { attendance_status } from '@prisma/client';

export class AttendanceService {
  private repo = new AttendanceRepository();

  private getStatusUrdu(status: string): string {
    switch (status) {
      case 'PRESENT': return 'حاضر';
      case 'ABSENT': return 'غیر حاضر';
      case 'LEAVE': return 'رخصت';
      default: return 'حاضر';
    }
  }

  async markQariSelfAttendance(loggedInUserId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE', remarks?: string) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) throw new Error('QARI_NOT_FOUND');
    return this.repo.markQariAttendance(qari.id, status, remarks);
  }

  // FIXED: No longer throws error on existing attendance, updates smoothly
  async markStudentAttendance(studentId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE', remarks?: string) {
    return this.repo.markStudentAttendance(studentId, status as attendance_status, remarks);
  }

  async getDashboardStats(loggedInUserId: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) throw new Error('QARI_NOT_FOUND');

    const dateInfo = getFormattedAttendanceDateUrdu(new Date());
    const targetClassId = qari.classId || 1;
    const stats = await this.repo.getDailyStatsByClassId(new Date(), targetClassId, qari.id);

    return {
      qariName: qari.user.name,
      className: qari.className,
      totalStudents: Number(stats.totalStudents),
      presentCount: Number(stats.presentCount),
      absentCount: Number(stats.absentCount),
      profile: {
        name: qari.user.name,
        role: 'قاری صاحب',
        hasUnreadNotifications: false,
        hasUnreadMessages: false,
      },
      classSummary: {
        className: qari.className,
        classId: targetClassId,
        gregorianDate: dateInfo.gregorianUrdu,
        hijriDate: dateInfo.hijriUrdu,
      },
      attendanceSummary: {
        totalStudents: Number(stats.totalStudents),
        presentCount: Number(stats.presentCount),
        absentCount: Number(stats.absentCount),
      },
      leaveRequests: [],
    };
  }

  async getStudentsForAttendance(loggedInUserId: number, classIdOverride?: number) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) throw new Error('QARI_NOT_FOUND');

    const targetClassId = classIdOverride || qari.classId || 1;
    return this.repo.getStudentsForAttendance(targetClassId, qari.id);
  }

  async getTrackStudents(loggedInUserId: number, classIdOverride?: number) {
    return this.getStudentsForAttendance(loggedInUserId, classIdOverride);
  }
// attendance.service.ts ke andar getStudentHistory method ko update karein:

async getStudentHistory(
  studentId: string | number,
  loggedInUserId: number,
  role: string,
  month?: number,
  year?: number
) {
  const numericStudentId = Number(studentId);
  if (role === 'PARENT' && !isNaN(numericStudentId)) {
    const isMyChild = await this.repo.checkParentAccess(loggedInUserId, numericStudentId);
    if (!isMyChild) throw new Error('FORBIDDEN_NOT_YOUR_CHILD');
  }

  const currentDate = new Date();
  const targetMonth = month || (currentDate.getMonth() + 1);
  const targetYear = year || currentDate.getFullYear();

  // Selected Month Name Formatting
  const monthNamesUrdu = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ];
  const monthNameUrdu = monthNamesUrdu[targetMonth - 1];

  const historyRecords = await this.repo.getStudentAttendanceHistory(studentId, targetMonth, targetYear);

  return {
    selectedMonth: {
      monthNumber: targetMonth,
      year: targetYear,
      monthNameUrdu: monthNameUrdu,
      displayName: `${monthNameUrdu} ${targetYear}`,
    },
    totalRecords: historyRecords.length,
    records: historyRecords.map((record: any) => {
      const recordDate = new Date(record.created_at || record.date);
      return {
        id: record.id,
        studentId: record.studentId,
        status: record.status, // PRESENT, ABSENT, LEAVE
        statusUrdu: this.getStatusUrdu(record.status),
        date: record.date,
        dateInfo: getFormattedAttendanceDateUrdu(recordDate),
        student: record.student || null,
      };
    })
  };
}
  
  async markBulkAttendance(loggedInUserId: number, data: any) {
    const qari = await this.repo.findQariByUserId(loggedInUserId);
    if (!qari) throw new Error('QARI_NOT_FOUND');

    const records = Array.isArray(data) ? data : data.records || data.attendance || [];
    if (!records || records.length === 0) throw new Error('NO_RECORDS_PROVIDED');

    return await this.repo.markBulkAttendance(qari.id, records);
  }
}