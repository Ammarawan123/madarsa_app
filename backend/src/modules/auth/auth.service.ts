import { FastifyInstance } from 'fastify';
import { AuthRepository } from './auth.repository';
import { OtpRepository } from '../otp/otp.repository';
import { hashToken } from '../../utils/token';
import { sendOtpEmail } from '../../utils/mailer';
import { comparePassword } from '../../utils/hash';
import { generateOTP } from '../../utils/otp-generator';
import prisma from '../../config/db';

export type UserRole = 'QARI' | 'PARENT';

export class AuthService {
  private static authRepository = new AuthRepository();
  private static otpRepository = new OtpRepository();

  // 1. Initiate Login (Password Verification + OTP Generation)
  static async initiateLogin(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    // User Find Karein
    const user = await prisma.users.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Password Verification
    const storedHash = user.password_hash || '';
    const isBcrypt =
      storedHash.startsWith('$2a$') ||
      storedHash.startsWith('$2b$') ||
      storedHash.startsWith('$2y$');

    const isPasswordValid = isBcrypt
      ? await comparePassword(password, storedHash)
      : password === storedHash;

    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Secure Crypto OTP Generator
    const otpCode = generateOTP(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to DB
    await this.otpRepository.createOtp(cleanEmail, otpCode, expiresAt);

    // Email Dispatch
    try {
      await sendOtpEmail(cleanEmail, otpCode);
    } catch (error) {
      console.error('⚠️ Email sending failed:', error);
    }

    return {
      message: 'Password verified. OTP sent to your email.',
      email: cleanEmail,
    };
  }

  // 2. Complete Login (Verify OTP)
  static async completeLogin(email: string, code: string) {
    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP Record
    const otpRecord = await this.otpRepository.findOtp(cleanEmail, code);

    if (!otpRecord) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // User Find Karein
    const user = await prisma.users.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // Delete OTP after successful verification
    await this.otpRepository.deleteOtp(otpRecord.id);

    return user;
  }

  // 3. Issue Access Token & Refresh Token pair
  static async issueTokens(
    fastify: FastifyInstance,
    userId: number,
    role: string
  ) {
    // Payload ko explicitly type cast kar ke sign karein
    const payload = { id: userId, role } as any;

    const accessToken = fastify.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = fastify.jwt.sign(payload, { expiresIn: '7d' });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepository.saveRefreshToken(userId, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  // 4. Generate new Access Token using valid Refresh Token
  static async refreshAccessToken(
    fastify: FastifyInstance,
    refreshToken: string
  ) {
    const decoded = fastify.jwt.verify(refreshToken) as any;

    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findValidToken(
      tokenHash,
      decoded.id
    );

    if (!storedToken) {
      throw new Error('INVALID_OR_REVOKED_TOKEN');
    }

    const payload = { id: decoded.id, role: decoded.role } as any;

    return fastify.jwt.sign(payload, { expiresIn: '15m' });
  }

  // 5. Revoke token on logout
  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await this.authRepository.revokeToken(tokenHash);
  }
}