import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z
    .string({ message: 'Email required hai' })
    .email({ message: 'Valid email address daraj karein' }),
});

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: 'Email required hai' })
    .email({ message: 'Valid email address daraj karein' }),
  code: z
    .string({ message: 'OTP code required hai' })
    .length(6, { message: 'OTP 6 digits ka hona chahiye' }),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;