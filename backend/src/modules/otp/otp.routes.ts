import { FastifyInstance } from 'fastify';
import {
  sendOtpHandler,
  verifyOtpHandler,
  resendOtpHandler,
} from './otp.controller';

export async function otpRoutes(fastify: FastifyInstance) {
  // OTP Endpoints ke liye strict rate limit rule
  const otpRateLimit = {
    config: {
      rateLimit: {
        max: 3, // 1 minute mein sirf 3 baar OTP request/verify ki ja sakti hai
        timeWindow: '1 minute',
      },
    },
  };

  fastify.post('/send', otpRateLimit, sendOtpHandler);
  fastify.post('/verify', otpRateLimit, verifyOtpHandler);
  fastify.post('/resend', otpRateLimit, resendOtpHandler);
}