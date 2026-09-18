import { IAuthStrategy } from './IAuthStrategy';
import { ApiAuthStrategy } from './ApiAuthStrategy';
import { LoginCredentials, LoginResult } from '@/types/auth.types';

class AuthService {
  private strategy: IAuthStrategy;

  constructor(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.strategy.login(credentials);
  }
}

// Direct API Strategy Export
export const authService = new AuthService(new ApiAuthStrategy());