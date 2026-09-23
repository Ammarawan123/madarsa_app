import { FastifyRequest, FastifyReply } from 'fastify';
import { OtpService } from './otp.service';
import { sendOtpSchema, verifyOtpSchema } from './otp.schema';
import { successResponse, errorResponse } from '../../utils/response';

const otpService = new OtpService();

export async function sendOtpHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = sendOtpSchema.parse(request.body);
    const cleanEmail = body.email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    console.log('📤 [SEND ROUTE HIT] Processing Email:', cleanEmail);

    await otpService.sendOtp(cleanEmail);
    return successResponse(reply, 200, 'OTP sent successfully');
  } catch (error: any) {
    console.error('❌ [SEND ROUTE ERROR]:', error);
    return errorResponse(reply, 400, error.message || 'Failed to send OTP');
  }
}

export async function verifyOtpHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log('📥 Raw Verification Body Received:', request.body);
    const body = verifyOtpSchema.parse(request.body);

    const cleanEmail = body.email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    const cleanCode = body.code.trim();

    console.log('🔍 Attempting Verification with:', { cleanEmail, cleanCode });

    // Returns user object directly from OtpService
    const user = await otpService.verifyOtp(cleanEmail, cleanCode);

    // Verify hone par JWT Token Sign karein
    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(reply, 200, 'OTP verified successfully', {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('❌ [VERIFY ROUTE ERROR]:', error);
    if (error.message === 'INVALID_OR_EXPIRED_OTP') {
      return errorResponse(reply, 400, 'Invalid or expired OTP code');
    }
    if (error.message === 'USER_NOT_FOUND') {
      return errorResponse(reply, 404, 'User account not found');
    }
    return errorResponse(reply, 500, 'Internal server error');
  }
}

export async function resendOtpHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = sendOtpSchema.parse(request.body);
    const cleanEmail = body.email.toLowerCase().replace(/[\s\n\r]+/g, '').trim();
    console.log('🔄 [RESEND ROUTE HIT] Processing Email:', cleanEmail);

    await otpService.sendOtp(cleanEmail);
    return successResponse(reply, 200, 'OTP resent successfully');
  } catch (error: any) {
    console.error('❌ [RESEND ROUTE ERROR]:', error);
    return errorResponse(reply, 400, error.message || 'Failed to resend OTP');
  }
}