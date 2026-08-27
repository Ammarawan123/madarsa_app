import { ICheckInStrategy } from './ICheckInStrategy';
import { MockCheckInStrategy } from './MockCheckInStrategy';
import { CheckInResult } from '@/types/checkin.types';

class CheckInService {
  private static instance: CheckInService;
  private strategy: ICheckInStrategy;

  private constructor(strategy: ICheckInStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): CheckInService {
    if (!CheckInService.instance) {
      // Real API taiyar hone par sirf yahan RealCheckInStrategy() daal dein
      CheckInService.instance = new CheckInService(new MockCheckInStrategy());
    }
    return CheckInService.instance;
  }

  setStrategy(strategy: ICheckInStrategy): void {
    this.strategy = strategy;
  }

  async checkIn(qariId: string): Promise<CheckInResult> {
    return this.strategy.checkIn(qariId);
  }
}

export const checkInService = CheckInService.getInstance();