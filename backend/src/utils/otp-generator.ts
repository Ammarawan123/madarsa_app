import crypto from 'crypto';

/**
 * Generates a random numeric OTP of specified length (default: 6 digits)
 * @param length - Length of the OTP (default is 6)
 * @returns OTP string
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

/**
 * Calculates OTP expiry timestamp (default: 15 minutes from current time)
 * @param minutes - Expiry time in minutes
 * @returns Date object for expiration
 */
export function getOtpExpiry(minutes: number = 15): Date {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60 * 1000);
}