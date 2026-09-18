import prisma from '../../config/db';

export class OtpRepository {
  // Pure Delete (If explicitly needed)
  async deleteExistingOtp(email: string) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    return prisma.otp.deleteMany({
      where: { email: cleanEmail },
    });
  }

  // Transaction-Safe Create
  async createOtp(email: string, code: string, expiresAt: Date) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();

    // Pehle purana record sweep karein phir insert karein
    await prisma.otp.deleteMany({ where: { email: cleanEmail } });

    const created = await prisma.otp.create({
      data: {
        email: cleanEmail,
        code: code.trim(),
        expires_at: expiresAt,
      },
    });

    console.log('✅ [DB WRITE SUCCESS] OTP Record Created:', created);
    return created;
  }

  // Timezone Agnostic & Safe Insensitive Lookup
  async findOtp(email: string, code: string) {
    const cleanEmail = email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    const cleanCode = code.trim();

    const record = await prisma.otp.findFirst({
      where: {
        email: { equals: cleanEmail, mode: 'insensitive' },
        code: cleanCode,
      },
      orderBy: { id: 'desc' },
    });

    console.log('🔥 DB Found OTP Record:', record);

    if (!record) return null;

    // Timezone safe Epoch Comparison
    const isNotExpired = new Date(record.expires_at).getTime() > Date.now();

    if (!isNotExpired) {
      console.log('❌ OTP Expired! DB Expiry:', record.expires_at);
      return null;
    }

    return record;
  }

  async deleteOtp(id: number) {
    return prisma.otp.delete({
      where: { id },
    });
  }
}