import { IAuthStrategy } from './IAuthStrategy';
import { LoginCredentials, LoginResult } from '@/types/auth.types';
import { Strings } from '@/constants/strings';

const MOCK_QARI_USER = {
  id: 'qari-001',
  name: 'استاد محمد علی',
  mobileNumber: '03001234567',
  role: 'qari' as const,
  assignedClass: 'حفظ - درجہ اول',
};

const MOCK_PARENT_USER = {
  id: 'parent-001',
  name: 'احمد والد',
  mobileNumber: '03009876543',
  role: 'parent' as const,
  assignedClass: undefined,
};

const MOCK_QARI_PASSWORD = '123456';
const MOCK_PARENT_PASSWORD = '111111';

export class MockAuthStrategy implements IAuthStrategy {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    // Real network jaisa feel dene ke liye artificial delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check qari credentials
    const isQariMatch =
      credentials.mobileNumber === MOCK_QARI_USER.mobileNumber &&
      credentials.password === MOCK_QARI_PASSWORD;

    if (isQariMatch) {
      return { success: true, user: MOCK_QARI_USER };
    }

    // Check parent credentials
    const isParentMatch =
      credentials.mobileNumber === MOCK_PARENT_USER.mobileNumber &&
      credentials.password === MOCK_PARENT_PASSWORD;

    if (isParentMatch) {
      return { success: true, user: MOCK_PARENT_USER };
    }

    return { success: false, errorMessage: Strings.errors.invalidCredentials };
  }
}