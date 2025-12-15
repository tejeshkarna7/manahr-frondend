'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Column } from '@/components/ui/DataTable';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { userService } from '@/services/user.service';
import { User, UserFilters, EmployeeType } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner, PageLoader } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/utils';

export default function EmployeesPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();

  // Filters state
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    employeeType: undefined,
    department: undefined,
  });

  // Debounced search
  const [searchInput, setSearchInput] = useState('');

  // Fetch employees
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => userService.getUsers(filters),
  });

  // Handle search
  const handleSearch = (value: string) => {
    setSearchInput(value);
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
    },
    {
      key: 'fullName',
      header: 'Name',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeType',
      header: 'Type',
      sortable: true,
      render: (user: User) => (
        <span className="capitalize text-gray-700">
          {user.employeeType?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'designation',
      header: 'Designation',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user: User) => (
        <Badge variant={getStatusColor(user.status)}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joining Date',
      sortable: true,
      render: (user: User) => (
        <span className="text-gray-700">
          {user.joiningDate ? formatDate(user.joiningDate) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          {hasPermission('users:read') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(`/employees/${user._id}`)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {hasPermission('users:update') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(`/employees/${user._id}/edit`)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {hasPermission('users:delete') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(user._id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await userService.deleteUser(id);
        refetch();
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Employees</h1>
          <p className="text-gray-600 mt-1">
            Manage your organization's employees
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('users:create') && (
            <>
              <Button
                variant="secondary"
                onClick={() => router.push('/employees/import')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={() => router.push('/employees/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status || ''}
            onChange={(e) =>
              handleFilterChange('status', e.target.value || undefined)
            }
            options={[]}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>

          {/* Employee Type Filter */}
          <Select
            value={filters.employeeType || ''}
            onChange={(e) =>
              handleFilterChange('employeeType', e.target.value || undefined)
            }
            options={[]}
          >
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </Select>
        </div>

        {/* Active Filters & Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {(filters.status || filters.employeeType) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: undefined,
                    employeeType: undefined,
                  })
                }
              >
                Clear Filters
              </Button>
            )}
          </div>
          <Button size="sm" variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {data?.data && data.data.length > 0 ? (
          <>
            <DataTable
              data={data.data}
              columns={columns}
              onSort={(key) => console.log('Sort by:', key)}
            />

            {/* Pagination */}
            {data.pagination && (
              <div className="border-t border-gray-200 p-4">
                <Pagination
                  currentPage={data.pagination.currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                  totalItems={data.pagination.totalItems}
                  itemsPerPage={data.pagination.itemsPerPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No employees found"
            description="Get started by adding your first employee"
            action={
              hasPermission('users:create')
                ? {
                    label: 'Add Employee',
                    onClick: () => router.push('/employees/new'),
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
