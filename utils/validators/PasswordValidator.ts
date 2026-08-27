import { IValidator } from './IValidator';
import { ValidationResult } from '@/types/auth.types';
import { Strings } from '@/constants/strings';

export class PasswordValidator implements IValidator {
  private readonly minLength = 6;

  validate(value: string): ValidationResult {
    if (!value) {
      return { isValid: false, errorMessage: Strings.errors.passwordRequired };
    }

    if (value.length < this.minLength) {
      return { isValid: false, errorMessage: Strings.errors.passwordTooShort };
    }

    return { isValid: true };
  }
}