import { FastifyRequest, FastifyReply } from 'fastify';
import { OtpService } from './otp.service';
import { sendOtpSchema, verifyOtpSchema } from './otp.schema';
import { successResponse, errorResponse } from '../../utils/response';

const otpService = new OtpService();

export async function sendOtpHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = sendOtpSchema.parse(request.body);

  try {
    const cleanEmail = body.email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    console.log('📤 [SEND ROUTE HIT] Processing Email:', cleanEmail);

    await otpService.sendOtp(cleanEmail);
    return successResponse(reply, 200, 'OTP sent successfully');
  } catch (error: any) {
    console.error('❌ [SEND ROUTE ERROR]:', error);
    return errorResponse(reply, 500, error.message || 'Failed to send OTP');
  }
}

export async function verifyOtpHandler(request: FastifyRequest, reply: FastifyReply) {
  console.log('📥 Raw Verification Body Received:', request.body);

  const body = verifyOtpSchema.parse(request.body);

  try {
    const cleanEmail = body.email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    const cleanCode = body.code.trim();

    console.log('🔍 Attempting Verification with:', { cleanEmail, cleanCode });

    const user = await otpService.verifyOtp(cleanEmail, cleanCode);

    return successResponse(reply, 200, 'OTP verified successfully', {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.message === 'INVALID_OR_EXPIRED_OTP') {
      return errorResponse(reply, 400, 'Invalid or expired OTP code');
    }
    return errorResponse(reply, 500, 'Internal server error');
  }
}