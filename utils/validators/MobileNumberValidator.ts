import { IValidator } from './IValidator';
import { ValidationResult } from '@/types/auth.types';
import { Strings } from '@/constants/strings';

export class MobileNumberValidator implements IValidator {
  private readonly pattern = /^03[0-9]{9}$/;

  validate(value: string): ValidationResult {
    if (!value.trim()) {
      return { isValid: false, errorMessage: Strings.errors.mobileRequired };
    }

    if (!this.pattern.test(value.trim())) {
      return { isValid: false, errorMessage: Strings.errors.mobileInvalid };
    }

    return { isValid: true };
  }
}