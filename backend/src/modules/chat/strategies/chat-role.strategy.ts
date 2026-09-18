import { ChatRepository } from '../chat.repository';
import { ChatError } from '../chat.service';

export interface IChatRoleStrategy {
  getContacts(repo: ChatRepository, roleRecordId: number, search?: string): Promise<any>;
  resolveThreadParty(
    repo: ChatRepository,
    roleRecordId: number,
    studentId: number,
    qariId: number,
    parentId: number
  ): Promise<{ studentId: number; qariId: number; parentId: number }>;
}

export class QariRoleStrategy implements IChatRoleStrategy {
  async getContacts(repo: ChatRepository, roleRecordId: number, search?: string) {
    return repo.getStudentsForQari(roleRecordId, search);
  }

  async resolveThreadParty(
    repo: ChatRepository,
    roleRecordId: number,
    studentId: number,
    qariId: number,
    parentId: number
  ) {
    const isOwner = await repo.isStudentInQariClass(studentId, roleRecordId);
    if (!isOwner) {
      throw new ChatError('FORBIDDEN_NOT_YOUR_STUDENT');
    }
    return { studentId, qariId: roleRecordId, parentId };
  }
}

export class ParentRoleStrategy implements IChatRoleStrategy {
  async getContacts(repo: ChatRepository, roleRecordId: number) {
    return repo.getQarisForParent(roleRecordId);
  }

  async resolveThreadParty(
    repo: ChatRepository,
    roleRecordId: number,
    studentId: number,
    qariId: number,
    parentId: number
  ) {
    const isMyChild = await repo.isStudentOfParent(studentId, roleRecordId);
    if (!isMyChild) {
      throw new ChatError('FORBIDDEN_NOT_YOUR_CHILD');
    }
    return { studentId, qariId, parentId: roleRecordId };
  }
}

// Registry — role naam se strategy nikalne ke liye (if/else ki jagah)
export const chatRoleStrategies: Record<string, IChatRoleStrategy> = {
  QARI: new QariRoleStrategy(),
  PARENT: new ParentRoleStrategy(),
};