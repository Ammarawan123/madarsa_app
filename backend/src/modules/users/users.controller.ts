import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './users.service';
import { AttendanceService } from '../attendance/attendance.service';

const attendanceService = new AttendanceService();

export class UserController {
  // 1. Existing Profile Method
  static async getProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const tokenUser = request.user as { id: number; email: string } | undefined;

    if (!tokenUser || !tokenUser.id) {
      reply.status(401).send({
        success: false,
        message: 'Unauthorized access. User context missing.',
      });
      return;
    }

    try {
      const userProfile = await UserService.getUserProfileById(Number(tokenUser.id));

      if (!userProfile) {
        reply.status(404).send({
          success: false,
          message: 'User profile not found.',
        });
        return;
      }

      reply.status(200).send({
        success: true,
        message: 'Profile data fetched successfully',
        data: userProfile,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);

      reply.status(500).send({
        success: false,
        message: 'Failed to fetch user profile',
      });
    }
  }

  // 2. Qari / Teacher Dashboard — returns live dashboard data for the home screen
  static async getDashboard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const tokenUser = request.user as { id: number } | undefined;

    if (!tokenUser || !tokenUser.id) {
      reply.status(401).send({ success: false, message: 'Unauthorized' });
      return;
    }

    try {
      const dashboardData = await attendanceService.getDashboardStats(Number(tokenUser.id));
      reply.status(200).send({
        success: true,
        data: dashboardData,
      });
    } catch (err: any) {
      if (err.message === 'QARI_NOT_FOUND') {
        reply.status(404).send({
          success: false,
          message: 'Qari profile not found. Please contact the administrator.',
        });
        return;
      }
      console.error('Error fetching teacher dashboard:', err);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch teacher dashboard data',
      });
    }
  }

  // 3. Parent Dashboard Method
  static async getParentDashboard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      reply.status(200).send({
        success: true,
        message: 'Parent Dashboard Data',
        data: {},
      });
    } catch (error) {
      console.error('Error fetching parent dashboard:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch parent dashboard data',
      });
    }
  }
}