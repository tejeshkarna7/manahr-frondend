import { api } from '@/lib/api/client';
import {
  Role,
  Permission,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

class RoleService {
  private baseUrl = '/roles';

  /**
   * Get all roles
   */
  async getRoles(filters?: PaginationParams): Promise<PaginatedResponse<Role>> {
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
    return await api.get<PaginatedResponse<Role>>(url);
  }

  /**
   * Get roles by maximum level
   */
  async getRolesByLevel(maxLevel: number): Promise<Role[]> {
    return await api.get<Role[]>(`${this.baseUrl}/by-level/${maxLevel}`);
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<Role> {
    return await api.get<Role>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create role
   */
  async createRole(data: Partial<Role>): Promise<Role> {
    return await api.post<Role>(this.baseUrl, data);
  }

  /**
   * Update role
   */
  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    return await api.put<Role>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Add permissions to role
   */
  async addPermissions(id: string, permissionIds: string[]): Promise<Role> {
    return await api.post<Role>(`${this.baseUrl}/${id}/permissions`, { permissionIds });
  }

  /**
   * Remove permissions from role
   */
  async removePermissions(id: string, permissionIds: string[]): Promise<Role> {
    return await api.delete<Role>(`${this.baseUrl}/${id}/permissions`, {
      data: { permissionIds },
    });
  }

  /**
   * Check if role has permission
   */
  async checkPermission(id: string, permission: string): Promise<boolean> {
    const result = await api.get<{ hasPermission: boolean }>(`${this.baseUrl}/${id}/check-permission/${permission}`);
    return result.hasPermission;
  }
}

class PermissionService {
  private baseUrl = '/permissions';

  /**
   * Get all permissions
   */
  async getPermissions(filters?: PaginationParams): Promise<PaginatedResponse<Permission>> {
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
    return await api.get<PaginatedResponse<Permission>>(url);
  }

  /**
   * Get permissions grouped by module
   */
  async getGroupedPermissions(): Promise<Record<string, Permission[]>> {
    return await api.get<Record<string, Permission[]>>(`${this.baseUrl}/grouped`);
  }

  /**
   * Search permissions
   */
  async searchPermissions(query: string): Promise<Permission[]> {
    return await api.get<Permission[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id: string): Promise<Permission> {
    return await api.get<Permission>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create permission
   */
  async createPermission(data: Partial<Permission>): Promise<Permission> {
    return await api.post<Permission>(this.baseUrl, data);
  }

  /**
   * Bulk create permissions
   */
  async bulkCreatePermissions(permissions: Partial<Permission>[]): Promise<Permission[]> {
    return await api.post<Permission[]>(`${this.baseUrl}/bulk`, { permissions });
  }

  /**
   * Update permission
   */
  async updatePermission(id: string, data: Partial<Permission>): Promise<Permission> {
    return await api.put<Permission>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete permission
   */
  async deletePermission(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Initialize default permissions
   */
  async initializePermissions(): Promise<Permission[]> {
    return await api.post<Permission[]>(`${this.baseUrl}/initialize`);
  }
}

export const roleService = new RoleService();
export const permissionService = new PermissionService();
