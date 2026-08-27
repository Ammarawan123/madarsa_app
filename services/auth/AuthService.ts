import { IAuthStrategy } from './IAuthStrategy';
import { MockAuthStrategy } from './MockAuthStrategy';
import { LoginCredentials, LoginResult } from '@/types/auth.types';

// Singleton — poori app mein ek hi AuthService instance
class AuthService {
  private static instance: AuthService;
  private strategy: IAuthStrategy;

  private constructor(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      // Real API taiyar hone par sirf yahan RealAuthStrategy() daal dein
      AuthService.instance = new AuthService(new MockAuthStrategy());
    }
    return AuthService.instance;
  }

  setStrategy(strategy: IAuthStrategy): void {
    this.strategy = strategy;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.strategy.login(credentials);
  }
}

export const authService = AuthService.getInstance();