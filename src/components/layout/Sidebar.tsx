'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  requiredPermission?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Employees',
    href: '/employees',
    icon: <Users className="w-5 h-5" />,
    requiredPermission: 'employees:read',
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: <Clock className="w-5 h-5" />,
    requiredPermission: 'attendance:read',
  },
  {
    label: 'Leave Management',
    href: '/leaves',
    icon: <Calendar className="w-5 h-5" />,
    requiredPermission: 'leave:read',
  },
  {
    label: 'Payroll',
    href: '/payroll',
    icon: <DollarSign className="w-5 h-5" />,
    requiredPermission: 'payroll:read',
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: <FileText className="w-5 h-5" />,
    requiredPermission: 'documents:read',
  },
  {
    label: 'Roles & Permissions',
    href: '/roles',
    icon: <Shield className="w-5 h-5" />,
    requiredPermission: 'system:configure',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    requiredPermission: 'settings:configure',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, hasPermission } = useAuthStore();

  // TODO: Enable permission checks in the future
  // const filteredNavItems = navItems.filter((item) => {
  //   if (!item.requiredPermission) return true;
  //   return hasPermission(item.requiredPermission);
  // });

  // For now, show all menu items without permission checks
  const filteredNavItems = navItems;

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">ManaHR</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Organization Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
          <p className="text-xs text-primary-600 font-medium">Organization</p>
          <p className="text-sm font-semibold text-primary-900 truncate">
            {user.organization}
          </p>
          <p className="text-xs text-primary-700">{user.organizationCode}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-semibold">
                {user.fullName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
