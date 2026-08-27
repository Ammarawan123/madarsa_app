export interface CheckInResult {
  success: boolean;
  checkedInAt?: Date;
  errorMessage?: string;
}