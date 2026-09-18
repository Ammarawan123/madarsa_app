import { FastifyInstance } from 'fastify';
import { authenticate, authorizeRole } from '../../middleware/auth.middleware';
import * as controller from './chat.controller';
import { openThreadSchema, threadIdParamSchema } from './chat.schema';

export async function chatRoutes(fastify: FastifyInstance) {
  // Contact list — QARI ko students, PARENT ko Qaris (role check andar service mein)
  fastify.get(
    '/chat/contacts',
    { preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])] },
    controller.getContactsHandler
  );

  // Kisi student par click karke thread open/create karna
  fastify.post('/chat/threads/open', {
    preHandler: [authenticate, authorizeRole(['QARI', 'PARENT'])],
    handler: async (request, reply) => {
      request.body = openThreadSchema.parse(request.body);
      return controller.openThreadHandler(request, reply);
    },
  });

  fastify.get('/chat/threads/:threadId/messages', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      request.params = threadIdParamSchema.parse(request.params);
      return controller.getHistoryHandler(request as any, reply);
    },
  });

  fastify.patch('/chat/threads/:threadId/read', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      request.params = threadIdParamSchema.parse(request.params);
      return controller.markReadHandler(request as any, reply);
    },
  });
}