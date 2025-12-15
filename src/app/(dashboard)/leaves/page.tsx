'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Calendar as CalendarIcon,
  Plus,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { leaveService } from '@/services/leave.service';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/utils';

// Leave Application Schema
const leaveApplicationSchema = z.object({
  leaveType: z.string().min(1, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  isHalfDay: z.boolean().optional(),
});

type LeaveApplicationData = z.infer<typeof leaveApplicationSchema>;

export default function LeavesPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined as string | undefined,
  });

  // Fetch my leaves
  const { data: leavesData, isLoading, refetch } = useQuery({
    queryKey: ['my-leaves', filters],
    queryFn: () => leaveService.getLeaves(filters as any),
  });

  // Fetch leave types
  const { data: leaveTypesData } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveService.getLeaveTypes(),
  });

  // Extract leave types array from response
  const leaveTypes = Array.isArray(leaveTypesData) ? leaveTypesData : [];

  // Fetch leave balance
  const { data: leaveBalanceData } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: () => leaveService.getLeaveBalance(user?._id || ''),
    enabled: !!user?._id,
  });

  // Extract leave balance array from response
  const leaveBalance = Array.isArray(leaveBalanceData) ? leaveBalanceData : [];

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveApplicationData>({
    resolver: zodResolver(leaveApplicationSchema),
  });

  // Apply leave mutation
  const applyMutation = useMutation({
    mutationFn: (data: LeaveApplicationData) => leaveService.applyLeave(data),
    onSuccess: () => {
      toast.success('Leave application submitted successfully!');
      setIsModalOpen(false);
      reset();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to apply leave');
    },
  });

  // Cancel leave mutation
  const cancelMutation = useMutation({
    mutationFn: (id: string) => leaveService.cancelLeave(id),
    onSuccess: () => {
      toast.success('Leave cancelled successfully!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel leave');
    },
  });

  const onSubmit = (data: LeaveApplicationData) => {
    applyMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Leaves</h1>
          <p className="text-gray-600 mt-1">Manage your leave applications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Leave</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {leaveBalance?.find(lb => lb.leaveTypeName === 'Annual Leave')?.daysRemaining || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {leaveBalance?.find(lb => lb.leaveTypeName === 'Annual Leave')?.daysAllowed || 0} days
                </p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sick Leave</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {leaveBalance?.find(lb => lb.leaveTypeName === 'Sick Leave')?.daysRemaining || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {leaveBalance?.find(lb => lb.leaveTypeName === 'Sick Leave')?.daysAllowed || 0} days
                </p>
              </div>
              <FileText className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casual Leave</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {leaveBalance?.find(lb => lb.leaveTypeName === 'Casual Leave')?.daysRemaining || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {leaveBalance?.find(lb => lb.leaveTypeName === 'Casual Leave')?.daysAllowed || 0} days
                </p>
              </div>
              <Clock className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Used</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {leaveBalance?.reduce((sum, lb) => sum + lb.daysUsed, 0) || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">days this year</p>
              </div>
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value || undefined, page: 1 })
                }
                options={[]}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <Button size="sm" variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leave Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    End Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Days
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leavesData?.data && leavesData.data.length > 0 ? (
                  leavesData.data.map((leave: any) => (
                    <tr key={leave._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {leave.leaveType?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(leave.startDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(leave.endDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {leave.numberOfDays}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(leave.status)}>
                          {leave.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {leave.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this leave?')) {
                                cancelMutation.mutate(leave._id);
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No leave applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {leavesData?.pagination && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <Pagination
                currentPage={leavesData.pagination.currentPage}
                totalPages={leavesData.pagination.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
                totalItems={leavesData.pagination.totalItems}
                itemsPerPage={leavesData.pagination.itemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Leave Type"
            required
            error={errors.leaveType?.message}
            {...register('leaveType')}
            options={[]}
          >
            <option value="">Select leave type</option>
            {leaveTypes?.map((type: any) => (
              <option key={type._id} value={type._id}>
                {type.name} ({type.daysAllowed} days)
              </option>
            ))}
          </Select>

          <Input
            label="Start Date"
            type="date"
            required
            error={errors.startDate?.message}
            {...register('startDate')}
          />

          <Input
            label="End Date"
            type="date"
            required
            error={errors.endDate?.message}
            {...register('endDate')}
          />

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                {...register('isHalfDay')}
              />
              <span className="text-sm text-gray-700">Half Day Leave</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={applyMutation.isPending}>
              {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
