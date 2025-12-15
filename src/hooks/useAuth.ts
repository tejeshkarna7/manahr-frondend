import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  return useAuthStore();
}

export function usePermissions() {
  const { hasPermission, hasModule, hasAction, canAccessData, role } = useAuthStore();

  return {
    hasPermission,
    hasModule,
    hasAction,
    canAccessData,
    role,
    // Common permission checks
    canViewUsers: () => hasPermission('users:read'),
    canCreateUsers: () => hasPermission('users:create'),
    canUpdateUsers: () => hasPermission('users:update'),
    canDeleteUsers: () => hasPermission('users:delete'),
    
    canViewAttendance: () => hasPermission('attendance:read'),
    canManageAttendance: () => hasPermission('attendance:create'),
    
    canViewLeaves: () => hasPermission('leaves:read'),
    canApproveLeaves: () => hasPermission('leaves:approve'),
    
    canViewPayroll: () => hasPermission('payroll:read'),
    canManagePayroll: () => hasPermission('payroll:create'),
    
    canViewDocuments: () => hasPermission('documents:read'),
    canManageDocuments: () => hasPermission('documents:create'),
    
    canManageRoles: () => hasPermission('roles:manage'),
    canManageSettings: () => hasPermission('settings:manage'),
    
    isAdmin: () => role?.name === 'Admin',
    isManager: () => role?.name === 'Manager',
    isEmployee: () => role?.name === 'Employee',
  };
}
