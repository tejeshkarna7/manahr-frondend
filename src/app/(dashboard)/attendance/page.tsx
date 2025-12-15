'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogIn,
  LogOut,
  Download,
} from 'lucide-react';
import { attendanceService } from '@/services/attendance.service';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate, formatTime } from '@/lib/utils';

export default function AttendancePage() {
  const router = useRouter();
  const { user, hasPermission } = useAuthStore();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch my attendance records
  const { data: attendanceRecords, isLoading, refetch } = useQuery({
    queryKey: ['my-attendance', filters],
    queryFn: () => attendanceService.getAttendance(filters),
  });

  // Clock In/Out Mutation
  const clockMutation = useMutation({
    mutationFn: (type: 'in' | 'out') =>
      type === 'in'
        ? attendanceService.clockIn()
        : attendanceService.clockOut(),
    onSuccess: (data, type) => {
      toast.success(`Successfully clocked ${type === 'in' ? 'in' : 'out'}!`);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to clock ${clockMutation.variables === 'in' ? 'in' : 'out'}`);
    },
  });

  // Check if already clocked in today
  const todayRecord = attendanceRecords?.data?.find((record: any) => {
    const recordDate = new Date(record.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return recordDate === today;
  });

  const isClockedIn = todayRecord && todayRecord.checkIn && !todayRecord.checkOut;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      case 'half_day':
        return 'info';
      default:
        return 'default';
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-gray-900 mt-2">My Attendance</h1>
        <p className="text-gray-600 mt-1">Track your attendance and work hours</p>
      </div>

      {/* Clock In/Out Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {todayRecord ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Clock In</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <LogIn className="h-5 w-5 text-green-600" />
                        <p className="text-lg font-semibold text-gray-900">
                          {formatTime(todayRecord.checkIn)}
                        </p>
                      </div>
                    </div>
                    {todayRecord.checkOut && (
                      <div>
                        <p className="text-sm text-gray-600">Clock Out</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <LogOut className="h-5 w-5 text-red-600" />
                          <p className="text-lg font-semibold text-gray-900">
                            {formatTime(todayRecord.checkOut)}
                          </p>
                        </div>
                      </div>
                    )}
                    {todayRecord.totalHours && (
                      <div>
                        <p className="text-sm text-gray-600">Working Hours</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <p className="text-lg font-semibold text-gray-900">
                            {todayRecord.totalHours.toFixed(2)} hrs
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No attendance recorded today</p>
                  </div>
                )}
              </div>
              <div>
                {!todayRecord ? (
                  <Button
                    size="lg"
                    onClick={() => clockMutation.mutate('in')}
                    disabled={clockMutation.isPending}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Clock In
                  </Button>
                ) : !todayRecord.checkOut ? (
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={() => clockMutation.mutate('out')}
                    disabled={clockMutation.isPending}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Clock Out
                  </Button>
                ) : (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Present Days</span>
                <span className="text-lg font-semibold text-green-600">22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Absent Days</span>
                <span className="text-lg font-semibold text-red-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Late Arrivals</span>
                <span className="text-lg font-semibold text-orange-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Hours</span>
                <span className="text-lg font-semibold text-blue-600">8.5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance History</CardTitle>
            <Button size="sm" variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Clock In
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Clock Out
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Working Hours
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords?.data && attendanceRecords.data.length > 0 ? (
                  attendanceRecords.data.map((record: any) => (
                    <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.clockIn ? formatTime(record.clockIn) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.clockOut ? formatTime(record.clockOut) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.workingHours ? `${record.workingHours.toFixed(2)} hrs` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(record.status)}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {attendanceRecords?.pagination && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <Pagination
                currentPage={attendanceRecords.pagination.currentPage}
                totalPages={attendanceRecords.pagination.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
                totalItems={attendanceRecords.pagination.totalItems}
                itemsPerPage={attendanceRecords.pagination.itemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
