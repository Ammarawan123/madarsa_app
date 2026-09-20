import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimitPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(rateLimit, {
    max: 10, // Global limit: 1 minute mein 100 requests
    timeWindow: '1 minute',
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
