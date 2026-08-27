import { ICheckInStrategy } from './ICheckInStrategy';
import { CheckInResult } from '@/types/checkin.types';

export class MockCheckInStrategy implements ICheckInStrategy {
  async checkIn(_qariId: string): Promise<CheckInResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return { success: true, checkedInAt: new Date() };
  }
}