import { FastifyRequest, FastifyReply } from 'fastify';

// Allowed roles type definition
export type UserRole = 'QARI' | 'PARENT';

/**
 * Authentication Middleware: Validates JWT Access Token
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      message: 'Unauthorized: Access token missing or invalid',
    });
  }
}

/**
 * Authorization Middleware: Restricts access to allowed roles (QARI or PARENT)
 */
export function authorizeRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: number; role: UserRole } | undefined;

    // Guard Clause 1: User context missing
    if (!user || !user.role) {
      reply.status(401).send({
        success: false,
        message: 'Unauthorized access. User context missing.',
      });
      return;
    }

    // Guard Clause 2: Check if user's role exists in allowedRoles
    if (!allowedRoles.includes(user.role)) {
      reply.status(403).send({
        success: false,
        message: `Forbidden: This resource is restricted to [${allowedRoles.join(', ')}] only.`,
      });
      return;
    }
  };
}