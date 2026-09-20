import { FastifyReply } from 'fastify';

export function sendSuccess<T>(
  reply: FastifyReply,
  message: string,
  data: T = null as unknown as T,
  statusCode = 200
) {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
}

export function sendError(
  reply: FastifyReply,
  message: string,
  statusCode = 400,
  errors: any = null
) {
  return reply.status(statusCode).send({
    success: false,
    message,
    errors,
  });
}