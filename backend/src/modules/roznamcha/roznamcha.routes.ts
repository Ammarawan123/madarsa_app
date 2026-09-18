import { FastifyInstance } from 'fastify';
import { authenticate, authorizeRole } from '../../middleware/auth.middleware';
import * as controller from './roznamcha.controller';

export async function roznamchaRoutes(fastify: FastifyInstance) {
  // 1. Qari Roznamcha Entry Submit/Update (HIFZ / NAZRA Strategy Auto-detect)
  fastify.post(
    '/roznamcha/qari/submit',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    controller.submitQariRoznamchaHandler
  );

  // 2. Parent Home Log Submit/Update
  fastify.post(
    '/roznamcha/parent/submit',
    { preHandler: [authenticate, authorizeRole(['PARENT'])] },
    controller.submitParentRoznamchaHandler
  );

  // 3. Roznamcha View (Qari aur Parent dono bache ka record dekh sakte hain)
  fastify.get(
    '/roznamcha/student/:studentId',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getStudentRoznamchaHandler
  );
}