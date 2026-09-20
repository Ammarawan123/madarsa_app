import { OtpRepository } from './otp.repository';
import { sendOtpEmail } from '../../utils/mailer';
import { generateOTP } from '../../utils/otp-generator';
import prisma from '../../config/db';

export class OtpService {
  private otpRepository: OtpRepository;

  constructor() {
    this.otpRepository = new OtpRepository();
  }

  // Send OTP via Real Email
  async sendOtp(email: string) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    
    // Crypto Utility se 6 Digit OTP Generate
    const code = generateOTP(6); 
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 5 Minutes Validity

    // 1. Purane OTP record clean karein
    await this.otpRepository.deleteExistingOtp(cleanEmail);

    // 2. DB Record Creation WITH Audit Log
    const createdOtp = await this.otpRepository.createOtp(cleanEmail, code, expiresAt);
    console.log("✅ [DB AUDIT] OTP Record Created Successfully:", createdOtp);

    // 3. Email Dispatch via Mailer Util
    await sendOtpEmail(cleanEmail, code);

    return { email: cleanEmail, expiresAt };
  }

  // Verify OTP
  async verifyOtp(email: string, code: string) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    const cleanCode = code.trim();

    console.log("🔍 [DB AUDIT] Attempting OTP Verification for:", cleanEmail);

    const validOtp = await this.otpRepository.findOtp(cleanEmail, cleanCode);

    if (!validOtp) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // OTP Delete karein
    await this.otpRepository.deleteOtp(validOtp.id);

    // Verified User fetch (Case-insensitive check for Postgres safety)
    const user = await prisma.users.findFirst({
      where: {
        email: { equals: cleanEmail, mode: 'insensitive' },
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  }
}