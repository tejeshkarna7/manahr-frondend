import { api } from '@/lib/api/client';
import { DashboardStats } from '@/types';

class DashboardService {
  private baseUrl = '/dashboard';

  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<DashboardStats> {
    return await api.get<DashboardStats>(`${this.baseUrl}/data`);
  }
}

export const dashboardService = new DashboardService();
