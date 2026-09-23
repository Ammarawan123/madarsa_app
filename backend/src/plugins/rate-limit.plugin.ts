import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimitPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(rateLimit, {
    max: process.env.NODE_ENV === 'production' ? 300 : 1000,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', 'localhost'],
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Aapne zyada requests bhej di hain. Barae meharbani ${context.after} baad dobara koshish karein.`,
    }),
  });
};

export default fp(rateLimitPlugin, {
  name: 'rate-limit-plugin',
});
