import { IAuthStrategy } from './IAuthStrategy';
import { LoginCredentials, LoginResult } from '@/types/auth.types';
import { Strings } from '@/constants/strings';

const MOCK_USER = {
  id: 'qari-001',
  name: 'عبداللہ احمد',
  mobileNumber: '03001234567',
  role: 'qari' as const,
  assignedClass: 'حفظ - درجہ اول',
};

const MOCK_PASSWORD = '123456';

export class MockAuthStrategy implements IAuthStrategy {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    // Real network jaisa feel dene ke liye artificial delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isMatch =
      credentials.mobileNumber === MOCK_USER.mobileNumber &&
      credentials.password === MOCK_PASSWORD;

    if (!isMatch) {
      return { success: false, errorMessage: Strings.errors.invalidCredentials };
    }

    return { success: true, user: MOCK_USER };
  }
}