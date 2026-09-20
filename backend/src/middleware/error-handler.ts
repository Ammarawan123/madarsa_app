import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  const statusCode = error.statusCode || 500;

  return reply.code(statusCode).send({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.validation || null,
  });
}
