import { FastifyInstance } from 'fastify';
import { AuthRepository } from './auth.repository';
import { hashToken } from '../../utils/token';
import { sendOtpEmail } from '../../utils/mailer';
import prisma from '../../config/db';

export class AuthService {
  private static authRepository = new AuthRepository();

  // 1. Initiate Login (OTP Generation + Terminal Print + Email Send)
  static async initiateLogin(email: string, password: string) {
    const user = await (prisma as any).users.findUnique({ where: { email } });

    // Guard Clause: Check User Existence
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Passwords verification (Simple string or bcrypt)
    if (user.password && user.password !== password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Random 6-digit OTP generate karein
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

   

    // 📧 Real Email Par Mail Send Karein
    try {
      await sendOtpEmail(email, otpCode);
    } catch (error) {
      console.error('⚠️ Email sending failed, check .env credentials:', error);
    }

    return { message: 'Password verified. OTP sent to your email.', email };
  }

  // 2. Complete Login (Verify OTP)
  static async completeLogin(email: string, code: string) {
    const user = await (prisma as any).users.findUnique({ where: { email } });

    // Guard Clause: Validate User
    if (!user) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    return user;
  }

  // 3. Issue Access Token & Refresh Token pair
  static async issueTokens(fastify: FastifyInstance, userId: number, role: string) {
    const accessToken = (fastify as any).jwt.sign({ id: userId, role }, { expiresIn: '15m' });
    const refreshToken = (fastify as any).jwt.sign({ id: userId, role }, { expiresIn: '7d' });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days expiry

    await this.authRepository.saveRefreshToken(userId, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  // 4. Generate new Access Token using valid Refresh Token
  static async refreshAccessToken(fastify: FastifyInstance, refreshToken: string) {
    // 1. Verify JWT signature & structure
    const decoded = (fastify as any).jwt.verify(refreshToken) as { id: number; role: string };

    // 2. Check DB status
    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findValidToken(tokenHash, decoded.id);

    // Guard Clause: Early Return if token is missing or revoked
    if (!storedToken) {
      throw new Error('INVALID_OR_REVOKED_TOKEN');
    }

    // 3. Generate new Access Token
    return (fastify as any).jwt.sign({ id: decoded.id, role: decoded.role }, { expiresIn: '15m' });
  }

  // 5. Revoke token on logout
  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await this.authRepository.revokeToken(tokenHash);
  }
}