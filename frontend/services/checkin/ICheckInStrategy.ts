import { CheckInResult } from '@/types/checkin.types';

export interface ICheckInStrategy {
  checkIn(qariId: string): Promise<CheckInResult>;
}