import { LoginCredentials, LoginResult } from '@/types/auth.types';

export interface IAuthStrategy {
  login(credentials: LoginCredentials): Promise<LoginResult>;
}