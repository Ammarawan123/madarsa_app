// Naya validator add karna ho to sirf ek file banayein aur yahan export karein
export * from './IValidator';
export * from './MobileNumberValidator';
export * from './PasswordValidator';

import { MobileNumberValidator } from './MobileNumberValidator';
import { PasswordValidator } from './PasswordValidator';

// Singleton instances — dobara-dobara "new" karne ki zaroorat nahi
export const mobileNumberValidator = new MobileNumberValidator();
export const passwordValidator = new PasswordValidator();