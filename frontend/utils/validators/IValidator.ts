import { ValidationResult } from '@/types/auth.types';

// Har validator isi contract ko follow karta hai — Strategy Pattern
export interface IValidator {
  validate(value: string): ValidationResult;
}