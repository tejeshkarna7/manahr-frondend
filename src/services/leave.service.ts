import { api } from '@/lib/api/client';
import {
  Leave,
  LeaveType,
  LeaveFilters,
  PaginatedResponse,
  LeaveFormData,
  LeaveBalance,
  LeaveStats,
} from '@/types';

class LeaveService {
  private baseUrl = '/leave';

  /**
   * Apply for leave
   */
  async applyLeave(data: LeaveFormData): Promise<Leave> {
    return await api.post<Leave>(this.baseUrl, data);
  }

  /**
   * Get leave requests with filters
   */
  async getLeaves(filters?: LeaveFilters): Promise<PaginatedResponse<Leave>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    return await api.get<PaginatedResponse<Leave>>(url);
  }

  /**
   * Get leave by ID
   */
  async getLeaveById(id: string): Promise<Leave> {
    return await api.get<Leave>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get employee leaves
   */
  async getEmployeeLeaves(employeeId: string, filters?: LeaveFilters): Promise<PaginatedResponse<Leave>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/employee/${employeeId}?${queryString}` : `${this.baseUrl}/employee/${employeeId}`;
    return await api.get<PaginatedResponse<Leave>>(url);
  }

  /**
   * Update leave
   */
  async updateLeave(id: string, data: Partial<LeaveFormData>): Promise<Leave> {
    return await api.put<Leave>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Cancel leave
   */
  async cancelLeave(id: string): Promise<Leave> {
    return await api.delete<Leave>(`${this.baseUrl}/${id}`);
  }

  /**
   * Approve leave
   */
  async approveLeave(id: string): Promise<Leave> {
    return await api.put<Leave>(`${this.baseUrl}/${id}/approve`);
  }

  /**
   * Reject leave
   */
  async rejectLeave(id: string, reason: string): Promise<Leave> {
    return await api.put<Leave>(`${this.baseUrl}/${id}/reject`, { rejectionReason: reason });
  }

  /**
   * Get leave balance
   */
  async getLeaveBalance(employeeId: string): Promise<LeaveBalance[]> {
    return await api.get<LeaveBalance[]>(`${this.baseUrl}/balance/${employeeId}`);
  }

  /**
   * Get leave statistics
   */
  async getStats(employeeId?: string): Promise<LeaveStats> {
    const url = employeeId ? `${this.baseUrl}/stats?employeeId=${employeeId}` : `${this.baseUrl}/stats`;
    return await api.get<LeaveStats>(url);
  }

  // Leave Type Management

  /**
   * Get all leave types
   */
  async getLeaveTypes(): Promise<LeaveType[]> {
    return await api.get<LeaveType[]>(`${this.baseUrl}/types`);
  }

  /**
   * Get leave type by ID
   */
  async getLeaveTypeById(id: string): Promise<LeaveType> {
    return await api.get<LeaveType>(`${this.baseUrl}/types/${id}`);
  }

  /**
   * Create leave type
   */
  async createLeaveType(data: Partial<LeaveType>): Promise<LeaveType> {
    return await api.post<LeaveType>(`${this.baseUrl}/types`, data);
  }

  /**
   * Update leave type
   */
  async updateLeaveType(id: string, data: Partial<LeaveType>): Promise<LeaveType> {
    return await api.put<LeaveType>(`${this.baseUrl}/types/${id}`, data);
  }

  /**
   * Delete leave type
   */
  async deleteLeaveType(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/types/${id}`);
  }

  /**
   * Bulk leave operations
   */
  async bulkOperation(operation: string, leaveIds: string[]): Promise<void> {
    await api.post(`${this.baseUrl}/bulk`, { operation, leaveIds });
  }
}

export const leaveService = new LeaveService();
