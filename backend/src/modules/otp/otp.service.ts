import prisma from '../../config/db';

export class OtpService {
  // OTP generate & save method
  async sendOtp(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save or Update OTP in DB
    await prisma.otp.upsert({
      where: { email: cleanEmail },
      update: {
        code: code,
        expires_at: expiresAt,
        created_at: new Date(),
      },
      create: {
        email: cleanEmail,
        code: code,
        expires_at: expiresAt,
      },
    });

    console.log(`📩 OTP generated for ${cleanEmail}: ${code}`);
    return { success: true, message: 'OTP sent successfully' };
  }

  // OTP verify method
  async verifyOtp(email: string, code: string) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    console.log(`🔍 [DB AUDIT] Attempting OTP Verification for: '${cleanEmail}' with code: '${cleanCode}'`);

    // 1. Fetch OTP record directly from DB
    const record = await prisma.otp.findUnique({
      where: { email: cleanEmail },
    });

    console.log('🔥 DB Found OTP Record:', record);

    if (!record) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // 2. Check if code matches
    if (record.code !== cleanCode) {
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // 3. Check if OTP is expired
    const now = new Date();
    if (record.expires_at < now) {
      // Cleanup expired OTP
      await prisma.otp.delete({ where: { email: cleanEmail } }).catch(() => {});
      throw new Error('INVALID_OR_EXPIRED_OTP');
    }

    // 4. Fetch actual user from DB for JWT Payload
    const user = await prisma.users.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // 5. Verification successful -> Delete OTP so it can't be reused
    await prisma.otp.delete({ where: { email: cleanEmail } });

    // 6. Return user object to Controller
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };
  }
}