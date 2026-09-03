import { HomeDashboardData } from '@/types/home.types';

export interface IHomeStrategy {
  getHomeDashboard(qariId: string): Promise<HomeDashboardData>;
  respondToLeaveRequest(requestId: string, approve: boolean): Promise<boolean>;
}