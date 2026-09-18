import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Authentication Middleware using Early Return & Guard Clause logic.
 * Ensures DRY principles by centralizing JWT Authorization check.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  // Guard Clause 1: Early Return if Authorization header is missing
  if (!authHeader) {
    reply.status(401).send({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
    return;
  }

  // Guard Clause 2: Early Return if header format is not Bearer
  if (!authHeader.startsWith('Bearer ')) {
    reply.status(401).send({
      success: false,
      message: 'Invalid token format. Token must follow "Bearer <TOKEN>" format.',
    });
    return;
  }

  try {
    // JWT Verification using Fastify JWT plugin
    await request.jwtVerify();
  } catch (error) {
    // Early Return on Token Verification failure (Expired/Tampered)
    reply.status(401).send({
      success: false,
      message: 'Invalid or expired token.',
    });
    return;
  }
}