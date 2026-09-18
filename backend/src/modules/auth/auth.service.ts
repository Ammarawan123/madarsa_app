import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { OtpRepository } from '../otp/otp.repository'; // 👈 OtpRepository import karein
import { hashToken } from '../../utils/token';
import { sendOtpEmail } from '../../utils/mailer';
import prisma from '../../config/db';

export class AuthService {
  private static authRepository = new AuthRepository();
  private static otpRepository = new OtpRepository(); // 👈 Instance create karein

  // 1. Initiate Login (OTP Generation + Password Verification)
  static async initiateLogin(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    // User find karein
    const user = await (prisma as any).users.findUnique({ 
      where: { email: cleanEmail } 
    });

    user || (() => { throw new Error('INVALID_CREDENTIALS'); })();

    // Password verification (bcrypt vs plaintext handling)
    const storedHash = user.password_hash || user.password || '';
    const isBcrypt = storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$');

    const isPasswordValid = isBcrypt
      ? await bcrypt.compare(password, storedHash)
      : password === storedHash;

    isPasswordValid || (() => { throw new Error('INVALID_CREDENTIALS'); })();

    // 6-digit OTP code generate karein
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // 💾 OtpRepository se DB mein save karein (Sahi Table Name: prisma.otp)
    await this.otpRepository.createOtp(cleanEmail, otpCode, expiresAt);

    // 📧 Mail send karein
    try {
      await sendOtpEmail(cleanEmail, otpCode);
    } catch (error) {
      console.error('⚠️ Email sending failed:', error);
    }

    return { message: 'Password verified. OTP sent to your email.', email: cleanEmail };
  }

  // 2. Complete Login (Verify OTP)
  static async completeLogin(email: string, code: string) {
    const cleanEmail = email.trim().toLowerCase();

    // 🔎 OtpRepository ka findOtp method use karke verify karein
    const otpRecord = await this.otpRepository.findOtp(cleanEmail, code);

    if (!otpRecord) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // User find karein
    const user = await (prisma as any).users.findUnique({ where: { email: cleanEmail } });
    user || (() => { throw new Error('INVALID_OR_EXPIRED_OTP'); })();

    // 🧹 Verification ke baad OTP delete kar dein
    await this.otpRepository.deleteOtp(otpRecord.id);

    return user;
  }

  // 3. Issue Access Token & Refresh Token pair
  static async issueTokens(fastify: FastifyInstance, userId: number, role: string) {
    const accessToken = (fastify as any).jwt.sign({ id: userId, role }, { expiresIn: '15m' });
    const refreshToken = (fastify as any).jwt.sign({ id: userId, role }, { expiresIn: '7d' });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepository.saveRefreshToken(userId, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  // 4. Generate new Access Token using valid Refresh Token
  static async refreshAccessToken(fastify: FastifyInstance, refreshToken: string) {
    const decoded = (fastify as any).jwt.verify(refreshToken) as { id: number; role: string };

    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findValidToken(tokenHash, decoded.id);

    storedToken || (() => { throw new Error('INVALID_OR_REVOKED_TOKEN'); })();

    return (fastify as any).jwt.sign({ id: decoded.id, role: decoded.role }, { expiresIn: '15m' });
  }

  // 5. Revoke token on logout
  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await this.authRepository.revokeToken(tokenHash);
  }
}