import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, Permission } from '@/types';
import { config } from '@/config';
import { TokenManager } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  role: Role | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  login: (user: User, role: Role, permissions: Permission[], accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // Permission checks
  hasPermission: (permission: string) => boolean;
  hasModule: (module: string) => boolean;
  hasAction: (module: string, action: string) => boolean;
  canAccessData: (dataLevel: 1 | 2 | 3) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setRole: (role) => set({ role }),
      
      setPermissions: (permissions) => set({ permissions }),
      
      login: (user, role, permissions, accessToken, refreshToken) => {
        // Tokens are now managed by NextAuth, not stored in localStorage
        set({
          user,
          role,
          permissions,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        TokenManager.clearTokens();
        set({
          user: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      hasPermission: (permission: string) => {
        const { permissions } = get();
        return permissions.some((p) => p.name === permission || p.fullName === permission);
      },
      
      hasModule: (module: string) => {
        const { permissions } = get();
        return permissions.some((p) => p.module === module);
      },
      
      hasAction: (module: string, action: string) => {
        const { permissions } = get();
        return permissions.some((p) => p.module === module && p.action === action);
      },
      
      canAccessData: (dataLevel: 1 | 2 | 3) => {
        const { role } = get();
        if (!role) return false;
        // Lower number = higher access
        // Level 1 (ALL) can access everything
        // Level 2 (TEAM) can access team and own
        // Level 3 (OWN) can only access own
        return role.dataAccessLevel <= dataLevel;
      },
    }),
    {
      name: config.userKey,
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
