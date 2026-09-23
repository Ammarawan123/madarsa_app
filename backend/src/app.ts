import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import prisma from './config/db';
import dbPlugin from './plugins/db.plugin';
import jwtPlugin from './plugins/jwt.plugin';
import rateLimitPlugin from './plugins/rate-limit.plugin';
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

// 1. CORS Register
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

// 2. Database Lifecycle Plugin Register
app.register(dbPlugin);

// 3. WebSocket Plugin Register
app.register(fastifyWebsocket);

// 4. JWT Plugin Register
app.register(jwtPlugin);

// 5. Rate Limiting Plugin Register (Routes se PEHLE aana zaroori hai)
app.register(rateLimitPlugin);

// Root Health Check Route (404 / error check karne ke liye)
app.get('/', async (request, reply) => {
  return reply.send({ success: true, message: 'Madrasa Backend API is running' });
});

// DB Connection Test Route
app.get('/test-db', async (request, reply) => {
  const users = await prisma.users.findMany({ take: 5 });
  return reply.send({
    success: true,
    message: 'Database connected successfully',
    data: users,
  });
});

// 6. API Routes Register
// 6. API Routes Register
app.register(authRoutes, { prefix: '/api/auth' });
app.register(otpRoutes, { prefix: '/api/otp' });

// Register userRoutes directly under /api to match /api/parent/student-summary
app.register(userRoutes, { prefix: '/api' }); 

app.register(attendanceRoutes, { prefix: '/api' });
app.register(roznamchaRoutes, { prefix: '/api' });
app.register(chatRoutes, { prefix: '/api' });
app.register(chatWsRoutes, { prefix: '/api' });

export default app;