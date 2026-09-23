import prisma from '../../config/db';
import { attendance_status } from '@prisma/client';

export function normalizeToStartOfDayUTC(input?: Date | string | null): Date {
  let d: Date;
  if (!input) {
    d = new Date();
  } else if (typeof input === 'string') {
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`);
    }
    d = new Date(input);
  } else {
    d = new Date(input.getTime());
  }

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

export class AttendanceRepository {
  // 1. Find Qari Profile by User ID
  async findQariByUserId(userId: number) {
    const cleanUserId = Number(userId);
    if (isNaN(cleanUserId)) throw new Error('INVALID_USER_ID');

    const qari = await prisma.qaris.findUnique({
      where: { user_id: cleanUserId },
      include: {
        users: { select: { full_name: true, role: true } },
        classes: { select: { id: true, class_name: true } },
      },
    });

    if (!qari) return null;

    let classId = qari.classes?.id ?? null;
    let className = qari.classes?.class_name ?? 'غیر مقرر';

    if (!classId) {
      const fallbackClass = await prisma.classes.findFirst({
        where: { qari_id: qari.id },
        select: { id: true, class_name: true },
      });
      if (fallbackClass) {
        classId = fallbackClass.id;
        className = fallbackClass.class_name;
      }
    }

    return {
      id: qari.id,
      user_id: qari.user_id,
      classId,
      className,
      user: {
        name: qari.users?.full_name || 'حافظ محمد ابراہیم',
        role: qari.users?.role || 'QARI',
      },
    };
  }

  // 2. Qari Self Attendance
  async markQariAttendance(qariId: number, status: 'PRESENT' | 'ABSENT' | 'LEAVE', remarks?: string) {
    const today = normalizeToStartOfDayUTC();
    return prisma.qari_attendance.upsert({
      where: {
        qari_id_date: {
          qari_id: qariId,
          date: today,
        },
      },
      update: { check_in_time: new Date() },
      create: {
        qari_id: qariId,
        date: today,
        check_in_time: new Date(),
      },
    });
  }

  // 3. Get Student Attendance For Date
  async getStudentAttendanceForDate(studentId: number, date: Date | string) {
    const cleanDate = normalizeToStartOfDayUTC(date);
    return prisma.student_attendance.findUnique({
      where: {
        student_id_date: {
          student_id: studentId,
          date: cleanDate,
        },
      },
    });
  }

  // 4. Mark Single Student Attendance (FIXED: Uses Upsert instead of Create)
  async markStudentAttendance(studentId: number, status: attendance_status, remarks?: string) {
    const today = normalizeToStartOfDayUTC();
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { classes: true },
    });

    if (!student) throw new Error('STUDENT_NOT_FOUND');

    const qariId = student.classes?.qari_id || 1;

    return prisma.student_attendance.upsert({
      where: {
        student_id_date: {
          student_id: studentId,
          date: today,
        },
      },
      update: {
        status: status,
        remarks: remarks || null,
        qari_id: qariId,
      },
      create: {
        student_id: studentId,
        qari_id: qariId,
        date: today,
        status: status,
        remarks: remarks || null,
      },
    });
  }

  // 4.5 Bulk Student Attendance Mark
  async markBulkAttendance(
    qariId: number,
    records: Array<{ studentId?: number; id?: number; status: string; remarks?: string; date?: string | Date }>
  ) {
    const operations = records.map((record) => {
      const studentId = Number(record.studentId || record.id);
      const recordDate = normalizeToStartOfDayUTC(record.date);

      const rawStatus = String(record.status || 'PRESENT').trim().toUpperCase();
      const formattedStatus = (['PRESENT', 'ABSENT', 'LEAVE'].includes(rawStatus)
        ? rawStatus
        : 'PRESENT') as attendance_status;

      return prisma.student_attendance.upsert({
        where: {
          student_id_date: {
            student_id: studentId,
            date: recordDate,
          },
        },
        update: {
          status: formattedStatus,
          remarks: record.remarks || null,
          qari_id: qariId,
        },
        create: {
          student_id: studentId,
          qari_id: qariId,
          status: formattedStatus,
          remarks: record.remarks || null,
          date: recordDate,
        },
      });
    });

    return await prisma.$transaction(operations);
  }

  // 5. Daily Stats Scoped to Class & Qari ID
  async getDailyStatsByClassId(date: Date | string, classId: number, qariId?: number) {
    const cleanClassId = Number(classId);
    const startOfDay = normalizeToStartOfDayUTC(date);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const totalStudents = await prisma.students.count({
      where: {
        OR: [
          { class_id: cleanClassId },
          ...(qariId ? [{ classes: { qari_id: Number(qariId) } }] : []),
        ],
      },
    });

    const attendanceRecords = await prisma.student_attendance.findMany({
      where: {
        AND: [
          {
            OR: [
              { students: { class_id: cleanClassId } },
              ...(qariId ? [{ qari_id: Number(qariId) }] : []),
            ],
          },
          {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        ],
      },
      select: {
        id: true,
        student_id: true,
        status: true,
      },
    });

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    for (const record of attendanceRecords) {
      const statusUpper = String(record.status).trim().toUpperCase();
      if (statusUpper === 'PRESENT') presentCount++;
      else if (statusUpper === 'ABSENT') absentCount++;
      else if (statusUpper === 'LEAVE') leaveCount++;
    }

    return {
      totalStudents,
      markedToday: attendanceRecords.length,
      presentCount,
      absentCount,
      leaveCount,
      unmarkedCount: Math.max(0, totalStudents - attendanceRecords.length),
    };
  }

  // 6. Get Active Students with TODAY's Attendance (FIXED)
  async getStudentsForAttendance(classId: number, qariId?: number) {
    const cleanClassId = Number(classId);
    const today = normalizeToStartOfDayUTC();

    const students = await prisma.students.findMany({
      where: {
        OR: [
          { class_id: cleanClassId },
          ...(qariId ? [{ classes: { qari_id: Number(qariId) } }] : []),
        ],
      },
      include: {
        student_attendance: {
          where: {
            date: today,
          },
          select: {
            status: true,
            remarks: true,
          },
        },
      },
      orderBy: { roll_number: 'asc' },
    });

    return students.map((s) => ({
      id: s.id,
      rollNumber: s.roll_number || String(s.id),
      fullName: s.full_name,
      trackType: s.track_type || 'HIFZ',
      // Dynamic status: Returns PRESENT / ABSENT / LEAVE or null if un-marked
      status: s.student_attendance[0]?.status || null,
      remarks: s.student_attendance[0]?.remarks || null,
    }));
  }

  async getStudentsByClassId(classId: number) {
    return this.getStudentsForAttendance(classId);
  }

  // 7. Attendance History
  async getStudentAttendanceHistory(studentOrClassId: string | number, month?: number, year?: number) {
    const parsedId = Number(studentOrClassId);
    const whereClause: any = {};

    if (!isNaN(parsedId)) {
      whereClause.student_id = parsedId;
    } else {
      const classNumericId = parseInt(String(studentOrClassId).replace(/\D/g, ''), 10);
      if (!isNaN(classNumericId)) {
        whereClause.students = { class_id: classNumericId };
      }
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      whereClause.date = { gte: startDate, lte: endDate };
    }

    const records = await prisma.student_attendance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        students: {
          select: {
            id: true,
            full_name: true,
            roll_number: true,
            track_type: true,
          },
        },
      },
    });

    return records.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      status: r.status,
      date: r.date,
      created_at: r.created_at,
      student: r.students
        ? {
            id: r.students.id,
            fullName: r.students.full_name,
            rollNumber: r.students.roll_number,
            trackType: r.students.track_type,
          }
        : null,
    }));
  }

  async checkParentAccess(parentUserId: number, studentId: number) {
    const student = await prisma.students.findFirst({
      where: {
        id: studentId,
        parents: { user_id: parentUserId },
      },
    });
    return !!student;
  }
}