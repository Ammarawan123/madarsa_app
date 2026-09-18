import { FastifyInstance } from 'fastify';
import { connectionManager } from '../chat.connection-manager';
import { ChatService, ChatError } from '../chat.service';

export interface WsContext { 
  fastify: FastifyInstance;
  socket: any;
  getUserId: () => number | null;
  setUserId: (id: number) => void;
}

export interface IWsMessageStrategy {
  handle(ctx: WsContext, payload: any, chatService: ChatService): Promise<void>;
}

export class AuthMessageStrategy implements IWsMessageStrategy {
  async handle(ctx: WsContext, payload: any) {
    try {
      const decoded = ctx.fastify.jwt.verify(payload.token) as { id: number };
      ctx.setUserId(decoded.id);
      connectionManager.add(decoded.id, ctx.socket);
      ctx.socket.send(JSON.stringify({ type: 'AUTH_SUCCESS' }));
    } catch {
      ctx.socket.send(JSON.stringify({ type: 'ERROR', message: 'Invalid token' }));
    }
  }
}

export class SendMessageStrategy implements IWsMessageStrategy {
  async handle(ctx: WsContext, payload: any, chatService: ChatService) {
    const userId = ctx.getUserId();

    // Guard clause — auth check
    if (!userId) {
      ctx.socket.send(JSON.stringify({ type: 'ERROR', message: 'Not authenticated' }));
      return;
    }

    try {
      const message = await chatService.sendMessage(payload.threadId, userId, payload.messageText);
      ctx.socket.send(JSON.stringify({ type: 'MESSAGE_SENT', data: message }));
    } catch (err) {
      const msg = err instanceof ChatError ? err.message : 'Failed to send message';
      ctx.socket.send(JSON.stringify({ type: 'ERROR', message: msg }));
    }
  }
}

// Registry — message type se strategy uthane ke liye (if/else ki jagah)
export const wsMessageStrategies: Record<string, IWsMessageStrategy> = {
  AUTH: new AuthMessageStrategy(),
  SEND_MESSAGE: new SendMessageStrategy(),
};