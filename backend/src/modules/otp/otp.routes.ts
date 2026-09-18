import { FastifyInstance } from 'fastify';
import { sendOtpHandler, verifyOtpHandler } from './otp.controller';

export async function otpRoutes(fastify: FastifyInstance) {
  // 1. SEND OTP ROUTE
  fastify.post('/send', sendOtpHandler);

  // 2. VERIFY OTP ROUTE
  fastify.post('/verify', verifyOtpHandler);
}