import { FastifyReply } from 'fastify';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: any;
}

export function successResponse<T>(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  data: T | null = null
): FastifyReply {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return reply.code(statusCode).send(response);
}

export function errorResponse(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  errors: any = null
): FastifyReply {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return reply.code(statusCode).send(response);
}