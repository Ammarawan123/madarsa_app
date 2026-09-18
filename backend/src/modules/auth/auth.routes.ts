import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  verifyOtpHandler,
  refreshHandler,
  logoutHandler,
} from './auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginHandler);
  fastify.post('/verify-login-otp', verifyOtpHandler);
  fastify.post('/refresh', refreshHandler);
  fastify.post('/logout', logoutHandler);
}