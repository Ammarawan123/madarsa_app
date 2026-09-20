import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import prisma from '../config/db';

const dbPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    // Database Connection Test
    await prisma.$connect();
    fastify.log.info('DATABASE: PostgreSQL/Prisma Connected Successfully');

    // Prisma ko fastify instance par decorate karein
    fastify.decorate('prisma', prisma);

    // Server close hone par DB connection close karein
    fastify.addHook('onClose', async () => {
      await prisma.$disconnect();
      fastify.log.info('DATABASE: PostgreSQL/Prisma Disconnected');
    });
  } catch (error: any) {
    fastify.log.error('DATABASE: Connection Failed', error?.message || error);
    process.exit(1);
  }
};

export default fp(dbPlugin, {
  name: 'db-plugin',
});