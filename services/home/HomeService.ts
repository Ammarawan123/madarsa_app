import { IHomeStrategy } from './IHomeStrategy';
import { MockHomeStrategy } from './MockHomeStrategy'; // Local mock strategy
import { HomeDashboardData } from '@/types/home.types';

class HomeService {
  private static instance: HomeService;
  private strategy: IHomeStrategy;

  private constructor(strategy: IHomeStrategy) {
    this.strategy = strategy;
  }

  static getInstance(): HomeService {
    if (!HomeService.instance) {
      // Direct local MockHomeStrategy initialize ki gayi hai
      HomeService.instance = new HomeService(new MockHomeStrategy());
    }
    return HomeService.instance;
  }

  setStrategy(strategy: IHomeStrategy): void {
    this.strategy = strategy;
  }

  async getHomeDashboard(qariId: string): Promise<HomeDashboardData> {
    return this.strategy.getHomeDashboard(qariId);
  }

  async respondToLeaveRequest(requestId: string, approve: boolean): Promise<boolean> {
    return this.strategy.respondToLeaveRequest(requestId, approve);
  }
}

export const homeService = HomeService.getInstance();