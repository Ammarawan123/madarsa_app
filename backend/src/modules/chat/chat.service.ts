import { ChatRepository } from './chat.repository';
import { connectionManager } from './chat.connection-manager';
import { chatRoleStrategies } from './strategies/chat-role.strategy';

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export class ChatService {
  private repo = new ChatRepository();

  async getContacts(user: { id: number; role: string; roleRecordId: number }, search?: string) {
    const strategy = chatRoleStrategies[user.role];
    if (!strategy) {
      throw new ChatError('UNSUPPORTED_ROLE'); // yeh guard clause hai, if/else chain nahi
    }
    return strategy.getContacts(this.repo, user.roleRecordId, search);
  }

  async openThread(user: { id: number; role: string; roleRecordId: number }, studentId: number) {
    const student = await this.repo.getStudentWithQari(studentId);
    if (!student) {
      throw new ChatError('STUDENT_NOT_FOUND');
    }

    const qariId = student.classes.qaris.id;
    const parentId = student.parent_id;

    const strategy = chatRoleStrategies[user.role];
    if (!strategy) {
      throw new ChatError('UNSUPPORTED_ROLE');
    }

    const resolved = await strategy.resolveThreadParty(this.repo, user.roleRecordId, studentId, qariId, parentId);
    return this.repo.findOrCreateThread(resolved.studentId, resolved.qariId, resolved.parentId);
  }

  private async assertThreadMember(threadId: number, userId: number) {
    const thread = await this.repo.getThreadById(threadId);
    if (!thread) {
      throw new ChatError('THREAD_NOT_FOUND');
    }

    const isMember = userId === thread.qari.users.id || userId === thread.parent.users.id;
    if (!isMember) {
      throw new ChatError('NOT_A_THREAD_MEMBER');
    }

    return thread;
  }

  async getHistory(threadId: number, requesterUserId: number) {
    await this.assertThreadMember(threadId, requesterUserId);
    return this.repo.getThreadMessages(threadId);
  }

  async sendMessage(threadId: number, senderUserId: number, messageText: string) {
    const thread = await this.assertThreadMember(threadId, senderUserId);
    const message = await this.repo.saveMessage(threadId, senderUserId, messageText);

    const qariUserId = thread.qari.users.id;
    const parentUserId = thread.parent.users.id;
    const receiverUserId = senderUserId === qariUserId ? parentUserId : qariUserId;

    const receiverSocket = connectionManager.get(receiverUserId);
    if (receiverSocket) {
      receiverSocket.send(JSON.stringify({ type: 'NEW_MESSAGE', data: message }));
    }

    return message;
  }

  async markAsRead(threadId: number, readerUserId: number) {
    await this.assertThreadMember(threadId, readerUserId);
    return this.repo.markMessagesAsRead(threadId, readerUserId);
  }
}