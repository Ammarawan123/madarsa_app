
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'qari' | 'parent';
  assignedClass?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  errorMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
export interface OtpVerificationPayload {
  email: string;
  otp: string;
}

export interface OtpResult {
  success: boolean;
  errorMessage?: string;
  user?: AuthUser;
}