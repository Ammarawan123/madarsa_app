import { FastifyInstance } from 'fastify';
import { authenticate, authorizeRole } from '../../middleware/auth.middleware';
import { UserController } from './users.controller';

export async function userRoutes(fastify: FastifyInstance) {
  // 1. Common Route: Qari aur Parent dono access kar sakte hain
  fastify.get(
    '/profile',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    UserController.getProfile
  );

  // 2. Qari Dedicated Route: Sirf Qari access kar sakta hai
  fastify.get(
    '/qari/dashboard',
    { preHandler: [authenticate, authorizeRole(['QARI'])] },
    async (request, reply) => {
      reply.send({ success: true, message: 'Welcome Qari Dashboard' });
    }
  );

  // 3. Parent Dedicated Route: Sirf Parent access kar sakta hai
  fastify.get(
    '/parent/dashboard',
    { preHandler: [authenticate, authorizeRole(['PARENT'])] },
    async (request, reply) => {
      reply.send({ success: true, message: 'Welcome Parent Dashboard' });
    }
  );
}