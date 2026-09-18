import { FastifyInstance } from 'fastify';
import { authenticate, authorizeRole } from '../../middleware/auth.middleware';
import * as controller from './attendance.controller';

export async function attendanceRoutes(fastify: FastifyInstance) {
  // 1. Qari Self Attendance
  fastify.post(
    '/attendance/qari/mark',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.markQariSelfAttendanceHandler
  );

  // 2. Get Students List
  fastify.get(
    '/attendance/students',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.getTrackStudentsHandler
  );

  // 3. Qari Mark Student Attendance
  fastify.post(
    '/attendance/student/mark',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.markStudentAttendanceHandler
  );

  // 4. Dashboard Stats
  fastify.get(
    '/attendance/dashboard-stats',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.getDashboardStatsHandler
  );

  // 5. Student History
  fastify.get(
    '/attendance/student/:studentId',
    { preHandler: [authenticate, authorizeRole(['PARENT', 'QARI'])] },
    controller.getStudentAttendanceHistoryHandler
  );
}