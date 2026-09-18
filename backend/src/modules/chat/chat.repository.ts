import prisma from '../../config/db';

export class ChatRepository {
  // QARI VIEW: uski class ke students, naam se search
  async getStudentsForQari(qariId: number, search?: string) {
    return prisma.students.findMany({
      where: {
        classes: { qari_id: qariId }, // relation field naam "classes", filter uske andar "qari_id"
        ...(search && { full_name: { contains: search, mode: 'insensitive' } }),
      },
      include: {
        parents: { include: { users: { select: { full_name: true } } } }, // "parents" -> "users"
        classes: true,
      },
      orderBy: { full_name: 'asc' },
    });
  }

  // PARENT VIEW: uske bacho ke Qaris
  async getQarisForParent(parentId: number) {
    const students = await prisma.students.findMany({
      where: { parent_id: parentId },
      include: {
        classes: {
          include: { qaris: { include: { users: { select: { full_name: true } } } } },
        },
      },
    });

    return students.map((student) => ({
      studentId: student.id,
      studentName: student.full_name,
      trackType: student.track_type,
      qariId: student.classes.qaris.id,
      qariName: student.classes.qaris.users.full_name,
    }));
  }

  async isStudentInQariClass(studentId: number, qariId: number) {
    const student = await prisma.students.findFirst({
      where: { id: studentId, classes: { qari_id: qariId } },
    });
    return !!student;
  }

  async isStudentOfParent(studentId: number, parentId: number) {
    const student = await prisma.students.findFirst({
      where: { id: studentId, parent_id: parentId },
    });
    return !!student;
  }

  async getStudentWithQari(studentId: number) {
    return prisma.students.findUnique({
      where: { id: studentId },
      include: {
        classes: { include: { qaris: true } },
        parents: true,
      },
    });
  }

  async findOrCreateThread(studentId: number, qariId: number, parentId: number) {
    const existing = await prisma.chat_threads.findFirst({
      where: { studentId, qariId, parentId }, // yeh already camelCase mapped hai schema mein
    });
    if (existing) return existing;

    return prisma.chat_threads.create({ data: { studentId, qariId, parentId } });
  }

  async saveMessage(threadId: number, senderId: number, messageText: string) {
    return prisma.chat_messages.create({ data: { threadId, senderId, messageText } });
  }

  async getThreadMessages(threadId: number) {
    return prisma.chat_messages.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { full_name: true, role: true } } }, // "sender" relation field, users ke andar full_name
    });
  }

  async getThreadById(threadId: number) {
    return prisma.chat_threads.findUnique({
      where: { id: threadId },
      include: {
        student: true,
        qari: { include: { users: true } },   // "qari" -> uske andar relation field "users"
        parent: { include: { users: true } }, // "parent" -> uske andar relation field "users"
      },
    });
  }

  async markMessagesAsRead(threadId: number, readerId: number) {
    return prisma.chat_messages.updateMany({
      where: { threadId, senderId: { not: readerId }, isRead: false },
      data: { isRead: true },
    });
  }
}