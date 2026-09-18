import crypto from 'crypto';

/**
 * Generates SHA-256 hash for storing Refresh Tokens securely in Database
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}