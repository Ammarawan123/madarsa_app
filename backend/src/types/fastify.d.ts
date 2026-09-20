import '@fastify/jwt';
import { PrismaClient } from '@prisma/client';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; role: 'QARI' | 'PARENT'; email: string };
    user: {
      id: number;
      role: 'QARI' | 'PARENT';
      email: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}