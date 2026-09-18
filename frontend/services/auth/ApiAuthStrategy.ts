import { IAuthStrategy } from './IAuthStrategy';
import { LoginCredentials, LoginResult } from '@/types/auth.types';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim();
console.log("🔥 Requesting URL:", `${API_URL}/api/auth/login`);

export class ApiAuthStrategy implements IAuthStrategy {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errorMessage: data.message || 'Login failed',
        };
      }

      // Backend se Token/User milne par success return karein
      return {
        success: true,
        user: data.user,
      };
    } catch {
      return {
        success: false,
        errorMessage: 'سروفر سے رابطہ نہیں ہو سکا۔',
      };
    }
  }
}