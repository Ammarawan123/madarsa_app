import { FastifyRequest, FastifyReply } from 'fastify';
import { ChatService, ChatError } from './chat.service';
import { successResponse, errorResponse } from '../../utils/response';

const service = new ChatService();

// DRY: saare ChatError messages ka ek hi jagah status code mapping
function mapChatErrorToStatus(message: string): number {
  const map: Record<string, number> = {
    STUDENT_NOT_FOUND: 404,
    THREAD_NOT_FOUND: 404,
    FORBIDDEN_NOT_YOUR_STUDENT: 403,
    FORBIDDEN_NOT_YOUR_CHILD: 403,
    NOT_A_THREAD_MEMBER: 403,
    UNSUPPORTED_ROLE: 400,
  };
  return map[message] || 500;
}

export async function getContactsHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number; role: string; roleRecordId: number };
  const { search } = request.query as { search?: string };

  try {
    const contacts = await service.getContacts(user, search);
    return successResponse(reply, 200, 'Contacts fetched successfully', contacts);
  } catch (err) {
    if (err instanceof ChatError) {
      return errorResponse(reply, mapChatErrorToStatus(err.message), err.message);
    }
    throw err;
  }
}

export async function openThreadHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { id: number; role: string; roleRecordId: number };
  const { studentId } = request.body as { studentId: number };

  try {
    const thread = await service.openThread(user, studentId);
    return successResponse(reply, 201, 'Chat thread ready', thread);
  } catch (err) {
    if (err instanceof ChatError) {
      return errorResponse(reply, mapChatErrorToStatus(err.message), err.message);
    }
    throw err;
  }
}

export async function getHistoryHandler(
  request: FastifyRequest<{ Params: { threadId: number } }>,
  reply: FastifyReply
) {
  const user = request.user as { id: number };
  try {
    const messages = await service.getHistory(request.params.threadId, user.id);
    return successResponse(reply, 200, 'Chat history fetched successfully', messages);
  } catch (err) {
    if (err instanceof ChatError) {
      return errorResponse(reply, mapChatErrorToStatus(err.message), err.message);
    }
    throw err;
  }
}

export async function markReadHandler(
  request: FastifyRequest<{ Params: { threadId: number } }>,
  reply: FastifyReply
) {
  const user = request.user as { id: number };
  try {
    await service.markAsRead(request.params.threadId, user.id);
    return successResponse(reply, 200, 'Messages marked as read');
  } catch (err) {
    if (err instanceof ChatError) {
      return errorResponse(reply, mapChatErrorToStatus(err.message), err.message);
    }
    throw err;
  }
}