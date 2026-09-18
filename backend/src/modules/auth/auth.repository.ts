import prisma from '../../config/db';

export class AuthRepository {
  /**
   * Save new refresh token hash in DB
   */
  async saveRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
    return (prisma as any).refresh_tokens.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });
  }

  /**
   * Find non-revoked and non-expired token
   */
  async findValidToken(tokenHash: string, userId: number) {
    return (prisma as any).refresh_tokens.findFirst({
      where: {
        token_hash: tokenHash,
        user_id: userId,
        revoked: false,
        expires_at: { gt: new Date() },
      },
    });
  }

  /**
   * Revoke single refresh token (Logout)
   */
  async revokeToken(tokenHash: string) {
    return (prisma as any).refresh_tokens.updateMany({
      where: { token_hash: tokenHash },
      data: { revoked: true },
    });
  }
}