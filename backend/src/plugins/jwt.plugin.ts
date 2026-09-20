import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is missing in .env');
  }

  await fastify.register(fastifyJwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: '15m',
    },
  });

  fastify.decorate(
    'authenticate',
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {
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