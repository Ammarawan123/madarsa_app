/**import { FastifyInstance } from 'fastify';
import { authorizeRole } from '../../middleware/auth.middleware';
import * as controller from './attendance.controller';

export async function attendanceRoutes(fastify: FastifyInstance) {
  // 1. Qari Self Attendance
  fastify.post(
    '/attendance/qari/mark',
    { preHandler: [fastify.authenticate, authorizeRole(['QARI'])] },
    controller.markQariSelfAttendanceHandler
  );

  // 2. Get Students List
  fastify.get(
    '/attendance/students',
    { preHandler: [fastify.authenticate, authorizeRole(['QARI'])] },
    controller.getTrackStudentsHandler
  );

  // 3. TODAY ATTENDANCE ROUTE (Yeh missing tha jis se error aa raha hai)
  fastify.get(
    '/attendance/today',
    { preHandler: [fastify.authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getTodayAttendanceHandler
  );

  // 4. Qari Mark Student Attendance
  fastify.post(
    '/attendance/student/mark',
    { preHandler: [fastify.authenticate, authorizeRole(['QARI'])] },
    controller.markStudentAttendanceHandler
  );

  // 5. Dashboard Stats
  fastify.get(
    '/attendance/dashboard-stats',
    { preHandler: [fastify.authenticate, authorizeRole(['QARI'])] },
    controller.getDashboardStatsHandler
  );

  // 6. Student History
  fastify.get(
    '/attendance/student/:studentId/history',
    { preHandler: [fastify.authenticate, authorizeRole(['PARENT', 'QARI'])] },
    controller.getStudentAttendanceHistoryHandler
  );
  
}**/
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

  // 2. Students List
  fastify.get(
    '/attendance/students-list',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.getTrackStudentsHandler
  );

  // 3. Class History (Fixed Query Param Route)
  fastify.get(
    '/attendance/class-history',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getStudentAttendanceHistoryHandler
  );

  // 4. NEW: Student Specific History Param Route (Fixes 404 GET /api/attendance/student/:studentId/history)
  fastify.get(
    '/attendance/student/:studentId/history',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getStudentAttendanceHistoryHandler
  );

  // 5. Today Attendance Route
  fastify.get(
    '/attendance/today',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getTodayAttendanceHandler
  );

  // 6. Mark Student Attendance
  fastify.post(
    '/attendance/student/mark',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.markStudentAttendanceHandler
  );

  // Bulk Attendance Route Add Karein
  fastify.post(
    '/attendance/mark-bulk',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.markBulkAttendanceHandler
  );

  // 7. Dashboard Stats
  fastify.get(
    '/attendance/dashboard-stats',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.getDashboardStatsHandler
  );
}