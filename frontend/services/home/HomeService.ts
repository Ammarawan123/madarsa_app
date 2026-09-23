import { ApiHomeStrategy } from './ApiHomeStrategy';
import { HomeDashboardData } from '@/types/home.types';

export class HomeService {
  private static instance: HomeService;
  private apiStrategy: ApiHomeStrategy;

  private constructor() {
    this.apiStrategy = new ApiHomeStrategy();
  }

  static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService();
    }
    return HomeService.instance;
  }

  getHomeDashboard(): Promise<HomeDashboardData> {
    return this.apiStrategy.getHomeDashboard();
  }

  respondToLeaveRequest(requestId: string, approve: boolean): Promise<boolean> {
    return this.apiStrategy.respondToLeaveRequest(requestId, approve);
  }
}

export const homeService = HomeService.getInstance();