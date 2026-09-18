import prisma from '../../config/db';

export class UserService {
  /**
   * Fetch user details by ID safely
   */
  static async getUserProfileById(userId: number) {
    const user = await (prisma.users as any).findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true, // updated_at hata diya gaya hai
      },
    });

    return user;
  }
}