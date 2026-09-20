import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  verifyOtpHandler,
  refreshHandler,
  logoutHandler,
} from './auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  // Sensitive endpoints par 1 minute mein max 5 attempts allow honge
  const strictRateLimit = {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
      },
    },
  };

  fastify.post('/login', strictRateLimit, loginHandler);
  fastify.post('/verify-login-otp', strictRateLimit, verifyOtpHandler);
  
  // Normal session management endpoints
  fastify.post('/refresh', refreshHandler);
  fastify.post('/logout', logoutHandler);
}
