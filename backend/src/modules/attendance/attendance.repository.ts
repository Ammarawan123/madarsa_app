import prisma from '../../config/db';

export class AttendanceRepository {
  // 1. Qari Apni Attendance Mark Kare (qari_attendance table)
  async markQariAttendance(qariId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE', remarks?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (prisma as any).qari_attendance.upsert({
      where: {
        qariId_date: { qariId, date: today },
      },
      update: { status, remarks },
      create: { qariId, date: today, status, remarks },
    });
  }

  // 2. Qari User ID se Qari Record + trackType ('HIFZ' | 'NAZRA') Fetch Karein
  async findQariByUserId(userId: number) {
    return (prisma as any).qari.findUnique({
      where: { userId },
      select: { id: true, trackType: true },
    });
  }

  // 3. Student Daily Attendance Mark / Update (student_attendance table)
  async markStudentAttendance(studentId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'LATE', remarks?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (prisma as any).student_attendance.upsert({
      where: {
        studentId_date: { studentId, date: today },
      },
      update: { status, remarks },
      create: { studentId, date: today, status, remarks },
    });
  }

  // 4. Qari Dashboard Stats (HIFZ / NAZRA trackType ke mutabiq Filtered)
  async getDailyStatsByTrack(date: Date, trackType: 'HIFZ' | 'NAZRA') {
    const totalStudents = await (prisma as any).student.count({
      where: { trackType },
    });

    const attendanceRecords = await (prisma as any).student_attendance.findMany({
      where: {
        date,
        student: { trackType },
      },
    });

    const presentCount = attendanceRecords.filter((r: any) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const absentCount = attendanceRecords.filter((r: any) => r.status === 'ABSENT').length;
    const leaveCount = attendanceRecords.filter((r: any) => r.status === 'LEAVE').length;

    return {
      trackType,
      totalStudents,
      markedToday: attendanceRecords.length,
      presentCount,
      absentCount,
      leaveCount,
      unmarkedCount: totalStudents - attendanceRecords.length,
    };
  }

  // 5. Track Type ke mutabiq Attendance List Display (HIFZ ya NAZRA Students)
  async getStudentsByTrack(trackType: 'HIFZ' | 'NAZRA') {
    return (prisma as any).student.findMany({
      where: { trackType },
      select: { id: true, fullName: true, rollNumber: true, trackType: true },
    });
  }

  // 6. Student Previous Attendance History
  async getStudentAttendanceHistory(studentId: number) {
    return (prisma as any).student_attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      include: {
        student: { select: { id: true, fullName: true, rollNumber: true, trackType: true } },
      },
    });
  }

  // 7. Parent Verification Check
  async checkParentAccess(userId: number, studentId: number) {
    const parent = await (prisma as any).parent.findUnique({ where: { userId } });
    if (!parent) return false;

    const student = await (prisma as any).student.findFirst({
      where: { id: studentId, parentId: parent.id },
    });

    return !!student;
  }
}