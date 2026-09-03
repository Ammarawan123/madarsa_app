export interface LoginCredentials {
  mobileNumber: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  mobileNumber: string;
  role: 'qari' | 'admin' | 'parent';
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