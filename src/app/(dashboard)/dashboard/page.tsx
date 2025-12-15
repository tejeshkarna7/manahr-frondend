'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { dashboardService } from '@/services/dashboard.service';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardData,
  });

  if (isLoading) return <PageLoader />;
  
  if (error) {
    return (
      <Alert
        type="error"
        title="Failed to load dashboard"
        message="Unable to fetch dashboard data. Please try again."
      />
    );
  }

  const stats = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalEmployees || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">12%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Employees */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.activeEmployees || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-gray-500">
                    {stats?.inactiveEmployees || 0} inactive
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.todayAttendance?.present || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-gray-500">
                    of {stats?.todayAttendance?.total || 0} employees
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Leaves */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.pendingLeaves || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-orange-600">Needs approval</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">Present</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.todayAttendance?.present || 0}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${((stats?.todayAttendance?.present || 0) / (stats?.todayAttendance?.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-700">Absent</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.todayAttendance?.absent || 0}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${((stats?.todayAttendance?.absent || 0) / (stats?.todayAttendance?.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-700">Late</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {stats?.todayAttendance?.late || 0}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${((stats?.todayAttendance?.late || 0) / (stats?.todayAttendance?.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(activity.timestamp, 'time')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.departmentDistribution && stats.departmentDistribution.length > 0 ? (
              stats.departmentDistribution.map((dept, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{dept.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{dept.department}</p>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-sm text-gray-500 text-center py-4">
                No department data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getAttendanceTrendData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Present"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Absent"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Late"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getLeaveStatusData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Employee Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getDepartmentData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getDepartmentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
                <Users className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-medium text-gray-900">Add Employee</p>
                <p className="text-xs text-gray-600 mt-1">Create new employee</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Mark Attendance</p>
                <p className="text-xs text-gray-600 mt-1">Quick attendance</p>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Apply Leave</p>
                <p className="text-xs text-gray-600 mt-1">Request leave</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-xs text-gray-600 mt-1">Analytics & reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Chart Data Helpers
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function getAttendanceTrendData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    date: day,
    present: Math.floor(Math.random() * 50) + 100,
    absent: Math.floor(Math.random() * 10) + 5,
    late: Math.floor(Math.random() * 15) + 5,
  }));
}

function getLeaveStatusData() {
  return [
    { status: 'Pending', count: 12 },
    { status: 'Approved', count: 45 },
    { status: 'Rejected', count: 8 },
  ];
}

function getDepartmentData() {
  return [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 30 },
    { name: 'Marketing', value: 25 },
    { name: 'HR', value: 15 },
    { name: 'Finance', value: 20 },
  ];
}

