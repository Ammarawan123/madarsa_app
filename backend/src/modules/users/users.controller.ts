import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './users.service';

export class UserController {
  static async getProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const tokenUser = request.user as { id: number; email: string } | undefined;

    // Guard Clause 1: Early Return if JWT payload is missing
    if (!tokenUser || !tokenUser.id) {
      reply.status(401).send({
        success: false,
        message: 'Unauthorized access. User context missing.',
      });
      return;
    }

    try {
      // Fetch fresh data from DB via Service Layer
      const userProfile = await UserService.getUserProfileById(Number(tokenUser.id));

      // Guard Clause 2: Early Return if user not found in DB
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
      // Terminal mein exact error dekhein
      console.error('Error fetching user profile:', error);

      reply.status(500).send({
        success: false,
        message: 'Failed to fetch user profile',
      });
    }
  }
}