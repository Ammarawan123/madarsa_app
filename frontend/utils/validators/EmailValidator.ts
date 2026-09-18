import { IValidator } from './IValidator';
import { ValidationResult } from '@/types/auth.types';
import { Strings } from '@/constants/strings';

export class EmailValidator implements IValidator {
  private readonly pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: string): ValidationResult {
    if (!value.trim()) {
      return { isValid: false, errorMessage: Strings.errors.emailRequired };
    }

    if (!this.pattern.test(value.trim())) {
      return { isValid: false, errorMessage: Strings.errors.emailInvalid };
    }

    return { isValid: true };
  }
}

export const emailValidator = new EmailValidator();