import { FastifyRequest, FastifyReply } from 'fastify';
import { AttendanceService } from './attendance.service';
import {
  markQariSelfAttendanceSchema,
  markStudentAttendanceSchema,
} from './attendance.schema';

const service = new AttendanceService();

// 1. Qari Self Attendance Handler
export async function markQariSelfAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  const body = markQariSelfAttendanceSchema.parse(request.body);

  try {
    const result = await service.markQariSelfAttendance(user.id, body.status, body.remarks);
    return reply.status(200).send({
      success: true,
      message: 'Qari attendance marked successfully',
      data: result,
    });
  } catch (err: any) {
    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }
    throw err;
  }
}

// 2. Mark Single Student Attendance Handler
export async function markStudentAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = markStudentAttendanceSchema.parse(request.body);

  try {
    const result = await service.markStudentAttendance(body.studentId, body.status, body.remarks);
    return reply.status(200).send({
      success: true,
      message: 'حاضری کامیابی سے درج ہو گئی',
      data: result,
    });
  } catch (err: any) {
    if (err.message === 'ATTENDANCE_ALREADY_MARKED') {
      return reply.status(400).send({
        success: false,
        message: 'اس طالب علم کی آج کی حاضری پہلے سے درج ہو چکی ہے',
      });
    }
    throw err;
  }
}

// 3. Mark Bulk Attendance Handler
export async function markBulkAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user as { id: number };
    const rawBody = request.body as any;

    const recordsPayload = Array.isArray(rawBody)
      ? rawBody
      : Array.isArray(rawBody?.records)
      ? rawBody.records
      : Array.isArray(rawBody?.attendance)
      ? rawBody.attendance
      : null;

    if (!recordsPayload || recordsPayload.length === 0) {
      return reply.status(400).send({
        success: false,
        message: 'Invalid request body. Non-empty array of attendance records required.',
      });
    }

    const result = await service.markBulkAttendance(Number(user.id), recordsPayload);

    return reply.status(200).send({
      success: true,
      message: 'Bulk attendance marked successfully',
      data: result,
    });
  } catch (err: any) {
    console.error('❌ Error marking bulk attendance:', err);

    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }

    return reply.status(500).send({
      success: false,
      message: 'Failed to mark bulk attendance',
    });
  }
}

// 4. Dashboard Stats Handler
export async function getDashboardStatsHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  try {
    const stats = await service.getDashboardStats(user.id);
    return reply.status(200).send({ success: true, data: stats });
  } catch (err: any) {
    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }
    throw err;
  }
}

// 5. Track / Attendance Students List Handler
export async function getTrackStudentsHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  try {
    const students = await service.getTrackStudents(user.id);
    return reply.status(200).send({ success: true, data: students });
  } catch (err: any) {
    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }
    throw err;
  }
}

// 6. Today Attendance Handler
export async function getTodayAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number; role: string };
  try {
    const todayData = await service.getTrackStudents(user.id);
    return reply.status(200).send({
      success: true,
      message: 'Aaj ki attendance fetched successfully',
      data: todayData,
    });
  } catch (err: any) {
    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }
    throw err;
  }
}

// 7. Student History Handler
export async function getStudentAttendanceHistoryHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const params = (request.params as { studentId?: string }) || {};
    const query = (request.query as { classId?: string; month?: string; year?: string; studentId?: string }) || {};
    const user = request.user as { id: number; role: string };

    const rawStudentOrClass: string = params.studentId || query.studentId || query.classId || '1';

    const history = await service.getStudentHistory(
      rawStudentOrClass,
      user.id,
      user.role,
      query.month ? Number(query.month) : undefined,
      query.year ? Number(query.year) : undefined
    );

    return reply.status(200).send({
      success: true,
      data: history || [],
    });
  } catch (err: any) {
    console.error('❌ Error in getStudentAttendanceHistoryHandler:', err);

    if (err.message === 'FORBIDDEN_NOT_YOUR_CHILD') {
      return reply.status(403).send({
        success: false,
        message: 'Unauthorized: Access restricted to your own child',
      });
    }

    return reply.status(200).send({
      success: true,
      data: [],
      message: 'No history records found',
    });
  }
}