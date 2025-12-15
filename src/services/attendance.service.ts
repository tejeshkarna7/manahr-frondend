import { api } from '@/lib/api/client';
import {
  Attendance,
  AttendanceFilters,
  PaginatedResponse,
  AttendanceFormData,
  AttendanceStats,
  AttendanceSettings,
} from '@/types';

class AttendanceService {
  private baseUrl = '/attendance';

  /**
   * Clock in (start work)
   */
  async clockIn(): Promise<Attendance> {
    return await api.post<Attendance>(`${this.baseUrl}/clock-in`);
  }

  /**
   * Clock out (end work)
   */
  async clockOut(): Promise<Attendance> {
    return await api.put<Attendance>(`${this.baseUrl}/clock-out`);
  }

  /**
   * Get current attendance status
   */
  async getStatus(): Promise<{ isLoggedIn: boolean; attendance?: Attendance }> {
    return await api.get(`${this.baseUrl}/status`);
  }

  /**
   * Reset today's attendance
   */
  async resetToday(): Promise<void> {
    await api.delete(`${this.baseUrl}/reset-today`);
  }

  /**
   * Get attendance records with filters
   */
  async getAttendance(filters?: AttendanceFilters): Promise<PaginatedResponse<Attendance>> {
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
    return await api.get<PaginatedResponse<Attendance>>(url);
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceById(id: string): Promise<Attendance> {
    return await api.get<Attendance>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get employee attendance
   */
  async getEmployeeAttendance(employeeId: string, filters?: AttendanceFilters): Promise<PaginatedResponse<Attendance>> {
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
    return await api.get<PaginatedResponse<Attendance>>(url);
  }

  /**
   * Mark attendance manually
   */
  async markAttendance(data: AttendanceFormData): Promise<Attendance> {
    return await api.post<Attendance>(this.baseUrl, data);
  }

  /**
   * Update attendance
   */
  async updateAttendance(id: string, data: Partial<AttendanceFormData>): Promise<Attendance> {
    return await api.put<Attendance>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete attendance
   */
  async deleteAttendance(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get attendance statistics
   */
  async getStats(employeeId?: string, startDate?: string, endDate?: string): Promise<AttendanceStats> {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/stats?${queryString}` : `${this.baseUrl}/stats`;
    return await api.get<AttendanceStats>(url);
  }

  /**
   * Bulk attendance operations
   */
  async bulkOperation(operation: string, data: any): Promise<void> {
    await api.post(`${this.baseUrl}/bulk`, { operation, ...data });
  }

  /**
   * Get attendance settings
   */
  async getSettings(): Promise<AttendanceSettings> {
    return await api.get<AttendanceSettings>('/settings/attendance');
  }

  /**
   * Update attendance settings
   */
  async updateSettings(data: Partial<AttendanceSettings>): Promise<AttendanceSettings> {
    return await api.put<AttendanceSettings>('/settings/attendance', data);
  }
}

export const attendanceService = new AttendanceService();
