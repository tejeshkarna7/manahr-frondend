import { api } from '@/lib/api/client';
import {
  User,
  UserFilters,
  PaginatedResponse,
  UserFormData,
  UserStats,
} from '@/types';

class UserService {
  private baseUrl = '/users';

  /**
   * Get all users with filters and pagination
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
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
    return await api.get<PaginatedResponse<User>>(url);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return await api.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new user
   */
  async createUser(data: UserFormData): Promise<User> {
    return await api.post<User>(this.baseUrl, data);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
    return await api.put<User>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return await api.get<User>(`${this.baseUrl}/profile`);
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: Partial<UserFormData>): Promise<User> {
    return await api.put<User>(`${this.baseUrl}/profile`, data);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    return await api.get<UserStats>(`${this.baseUrl}/stats`);
  }

  /**
   * Get all employees
   */
  async getEmployees(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/employees?${queryString}` : `${this.baseUrl}/employees`;
    return await api.get<PaginatedResponse<User>>(url);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<User> {
    return await api.get<User>(`${this.baseUrl}/employees/${id}`);
  }

  /**
   * Create employee
   */
  async createEmployee(data: UserFormData): Promise<User> {
    return await api.post<User>(`${this.baseUrl}/employees`, data);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: Partial<UserFormData>): Promise<User> {
    return await api.put<User>(`${this.baseUrl}/employees/${id}`, data);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/employees/${id}`);
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStats(): Promise<any> {
    return await api.get(`${this.baseUrl}/employees/stats`);
  }

  /**
   * Get departments list
   */
  async getDepartments(): Promise<string[]> {
    return await api.get<string[]>(`${this.baseUrl}/employees/departments`);
  }

  /**
   * Get users above current role level
   */
  async getUsersAboveRole(): Promise<User[]> {
    return await api.get<User[]>(`${this.baseUrl}/above-role`);
  }

  /**
   * Bulk user operations
   */
  async bulkOperation(operation: 'delete' | 'activate' | 'deactivate', userIds: string[]): Promise<void> {
    await api.post(`${this.baseUrl}/bulk`, {
      operation,
      userIds,
    });
  }
}

export const userService = new UserService();
