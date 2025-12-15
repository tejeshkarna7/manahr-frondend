'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Check,
  X,
} from 'lucide-react';
import { roleService } from '@/services/role.service';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const MODULES = [
  { id: 'users', name: 'Users & Employees', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'attendance', name: 'Attendance', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'leaves', name: 'Leave Management', actions: ['read', 'create', 'approve', 'reject'] },
  { id: 'payroll', name: 'Payroll', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'documents', name: 'Documents', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'reports', name: 'Reports', actions: ['read', 'export'] },
  { id: 'settings', name: 'Settings', actions: ['read', 'update'] },
];

export default function RolesPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Mock roles data
  const rolesData = {
    data: [
      {
        _id: '1',
        name: 'Admin',
        description: 'Full system access',
        userCount: 5,
        permissions: ['*'],
      },
      {
        _id: '2',
        name: 'Manager',
        description: 'Department management access',
        userCount: 12,
        permissions: ['users:read', 'attendance:*', 'leaves:*', 'reports:read'],
      },
      {
        _id: '3',
        name: 'Employee',
        description: 'Basic employee access',
        userCount: 145,
        permissions: ['users:read', 'attendance:read', 'leaves:read', 'documents:read'],
      },
    ],
  };

  const isLoading = false;

  const canManage = hasPermission('roles:manage') || hasPermission('system:configure');

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">Manage user roles and access control</p>
        </div>
        {canManage && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {rolesData.data.length}
                </p>
              </div>
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">162</p>
              </div>
              <Users className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Roles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <Shield className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rolesData.data.map((role) => (
          <Card key={role._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
                {canManage && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {role.name !== 'Admin' && (
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Users with this role</span>
                  <Badge variant="default">{role.userCount}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm, idx) => (
                      <Badge key={idx} variant="info">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Module
                  </th>
                  {rolesData.data.map((role) => (
                    <th
                      key={role._id}
                      className="text-center py-3 px-4 text-sm font-semibold text-gray-700"
                    >
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((module) => (
                  <tr key={module.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{module.name}</td>
                    {rolesData.data.map((role) => (
                      <td key={role._id} className="py-3 px-4 text-center">
                        {role.permissions.includes('*') ||
                        role.permissions.some((p: string) => p.startsWith(module.id)) ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
      >
        <form className="space-y-4">
          <Input label="Role Name" placeholder="e.g., Team Lead" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description of this role"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Permissions</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {MODULES.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-2">{module.name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {module.actions.map((action) => (
                      <label key={action} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-700 capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
