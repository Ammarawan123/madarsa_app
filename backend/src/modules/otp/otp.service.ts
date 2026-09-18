import { OtpRepository } from './otp.repository';
import { transporter } from '../../config/mail';
import prisma from '../../config/db';

export class OtpService {
  private otpRepository: OtpRepository;

  constructor() {
    this.otpRepository = new OtpRepository();
  }

  // Send OTP via Real Email
  async sendOtp(email: string) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 1. Purane record clean karein
    await this.otpRepository.deleteExistingOtp(cleanEmail);

    // 2. DB Record Creation WITH Audit Log
    const createdOtp = await this.otpRepository.createOtp(cleanEmail, code, expiresAt);
    console.log("✅ [DB AUDIT] OTP Record Created Successfully:", createdOtp);

    // 3. Email Dispatch
    await transporter.sendMail({
      from: `"Madarsa App" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: 'Your Verification OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification Code</h2>
          <p>Aapka verification code yeh hai:</p>
          <h1 style="color: #4CAF50; letter-spacing: 4px;">${code}</h1>
          <p>Yeh code 5 minutes mein expire ho jayega.</p>
        </div>
      `,
    });

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