import Fastify from 'fastify';
import cors from '@fastify/cors'; // <-- 1. Import CORS
import fastifyWebsocket from '@fastify/websocket';
import prisma from './config/db';
import jwtPlugin from './plugins/jwt.plugin';
import { authRoutes } from './modules/auth/auth.routes';
import { otpRoutes } from './modules/otp/otp.routes';
import { userRoutes } from './modules/users/users.routes';
import { attendanceRoutes } from './modules/attendance/attendance.routes';
import { roznamchaRoutes } from './modules/roznamcha/roznamcha.routes';
import { chatRoutes } from './modules/chat/chat.routes';
import { chatWsRoutes } from './modules/chat/chat.ws-routes';
import { errorHandler } from './middleware/error-handler';

const app = Fastify({ logger: true });

// Error Handler
app.setErrorHandler(errorHandler);

// 2. Register CORS (Sabse pehle register karein)
app.register(cors, {
  origin: true, // Sab cross-origin requests ko allow karega
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

// WebSocket Plugin Register
app.register(fastifyWebsocket);

// JWT Plugin Register
app.register(jwtPlugin);

// DB Connection Test Route
app.get('/test-db', async (request, reply) => {
  const users = await prisma.users.findMany({ take: 5 });
  return reply.send({
    success: true,
    message: 'Database connected successfully',
    data: users,
  });
});

// Routes Register
app.register(authRoutes, { prefix: '/api/auth' });
app.register(otpRoutes, { prefix: '/api/otp' });
app.register(userRoutes, { prefix: '/api/user' });
app.register(attendanceRoutes, { prefix: '/api' });
app.register(roznamchaRoutes, { prefix: '/api' });
app.register(chatRoutes as any, { prefix: '/api' });
app.register(chatWsRoutes as any, { prefix: '/api' });

export default app;