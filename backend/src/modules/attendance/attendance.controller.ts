import { FastifyRequest, FastifyReply } from 'fastify';
import { AttendanceService } from './attendance.service';
import {
  markQariSelfAttendanceSchema,
  markStudentAttendanceSchema,
  studentParamSchema,
} from './attendance.schema';

const service = new AttendanceService();

// 1. Qari Self Attendance Handler
export async function markQariSelfAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number };
  
  // Zod manual parse (ye automatically valid request na hone par error throw karega)
  const body = markQariSelfAttendanceSchema.parse(request.body);

  try {
    const result = await service.markQariSelfAttendance(user.id, body.status, body.remarks);
    return reply.status(200).send({ success: true, message: 'Qari attendance marked successfully', data: result });
  } catch (err: any) {
    if (err.message === 'QARI_NOT_FOUND') {
      return reply.status(404).send({ success: false, message: 'Qari profile not found' });
    }
    throw err;
  }
}

// 2. Mark Student Attendance Handler
export async function markStudentAttendanceHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = markStudentAttendanceSchema.parse(request.body);

  const result = await service.markStudentAttendance(body.studentId, body.status, body.remarks);
  return reply.status(200).send({ success: true, message: 'Student attendance marked successfully', data: result });
}

// 3. Dashboard Stats Handler
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

// 4. Track Students Handler
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

// 5. Student History Handler
export async function getStudentAttendanceHistoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const params = studentParamSchema.parse(request.params);
  const user = request.user as { id: number; role: string };

  try {
    const history = await service.getStudentHistory(Number(params.studentId), user.id, user.role);
    return reply.status(200).send({ success: true, data: history });
  } catch (err: any) {
    if (err.message === 'FORBIDDEN_NOT_YOUR_CHILD') {
      return reply.status(403).send({ success: false, message: 'Unauthorized: Access restricted to your own child' });
    }
    throw err;
  }
}