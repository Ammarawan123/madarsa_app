import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Fastify type definition ko extend kar rahe hain taake TypeScript compiler error na de
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  // Fastify JWT Plugin Register
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key-madarsa-app-2026',
    sign: {
      expiresIn: '15m', // Access Token duration
    },
  });

  // Authentication Decorator Guard
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          message: 'Unauthorized: Invalid or expired token',
          errors: null,
        });
      }
    }
  );
});