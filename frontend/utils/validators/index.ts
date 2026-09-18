import { EmailValidator } from './EmailValidator';
import { PasswordValidator } from './PasswordValidator';

// Base Interfaces Export
export * from './IValidator';
export * from './EmailValidator';
export * from './PasswordValidator';

// Singleton instances — pure app mein ek hi instance use hoga
export const emailValidator = new EmailValidator();
export const passwordValidator = new PasswordValidator();