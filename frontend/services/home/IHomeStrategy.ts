import { HomeDashboardData } from '@/types/home.types';

export interface IHomeStrategy {
  getHomeDashboard(): Promise<HomeDashboardData>;
  respondToLeaveRequest(requestId: string, approve: boolean): Promise<boolean>;
}