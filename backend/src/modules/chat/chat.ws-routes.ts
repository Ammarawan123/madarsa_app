import { FastifyInstance, FastifyRequest } from 'fastify';
import '@fastify/websocket';
import { connectionManager } from './chat.connection-manager';
import { ChatService } from './chat.service';
import { wsMessageStrategies } from './strategies/ws-message.strategy';
import type { WsContext } from './strategies/ws-message.strategy';

const chatService = new ChatService();

export async function chatWsRoutes(fastify: FastifyInstance) {
  fastify.get('/ws/chat', { websocket: true }, (connection: any, request: FastifyRequest) => {
    const socket = connection.socket ?? connection;

    // 1. Extract userId safely from query params
    const query = request.query as { userId?: string };
    let userId: number | null = query?.userId ? Number(query.userId) : null;

    // 2. Immediately register active connection in ConnectionManager
    if (userId && !isNaN(userId)) {
      connectionManager.add(userId, socket);
    }

    const ctx: WsContext = {
      fastify,
      socket,
      getUserId: () => userId,
      setUserId: (id: number) => {
        userId = id;
        if (userId) {
          connectionManager.add(userId, socket);
        }
      },
    };

    socket.on('message', async (rawMessage: Buffer) => {
      let payload: any;

      try {
        payload = JSON.parse(rawMessage.toString());
      } catch {
        socket.send(JSON.stringify({ type: 'ERROR', message: 'Invalid JSON' }));
        return;
      }

      const strategy = wsMessageStrategies[payload.type];

      if (!strategy) {
        socket.send(JSON.stringify({ type: 'ERROR', message: 'Unknown message type' }));
        return;
      }

      await strategy.handle(ctx, payload, chatService);
    });

    socket.on('close', () => {
      if (userId) {
        // Safe Removal: Ensure active map item is cleared
        const activeSocket = connectionManager.get(userId);
        if (activeSocket === socket) {
          connectionManager.remove(userId);
        }
      }
    });

    socket.on('error', (err:any) => {
      console.error(`WebSocket Error for User ${userId}:`, err);
    });
  });
}