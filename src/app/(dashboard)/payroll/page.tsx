'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PayrollPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuthStore();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    year: new Date().getFullYear(),
    month: undefined as number | undefined,
  });

  // Mock payroll data - replace with actual API call
  const payrollData = {
    data: [
      {
        _id: '1',
        month: 'November',
        year: 2025,
        basicSalary: 50000,
        hra: 15000,
        allowances: 10000,
        deductions: 5000,
        netSalary: 70000,
        status: 'paid',
        paidOn: '2025-11-30',
      },
      {
        _id: '2',
        month: 'October',
        year: 2025,
        basicSalary: 50000,
        hra: 15000,
        allowances: 10000,
        deductions: 5000,
        netSalary: 70000,
        status: 'paid',
        paidOn: '2025-10-31',
      },
    ],
    pagination: {
      page: 1,
      pages: 1,
      total: 2,
      limit: 10,
    },
  };

  const isLoading = false;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Payroll</h1>
          <p className="text-gray-600 mt-1">View your salary slips and payment history</p>
        </div>
      </div>

      {/* Salary Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Salary</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(70000)}
                </p>
                <p className="text-xs text-gray-500 mt-1">per month</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">YTD Earnings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(840000)}
                </p>
                <p className="text-xs text-gray-500 mt-1">year to date</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(60000)}
                </p>
                <p className="text-xs text-gray-500 mt-1">this year</p>
              </div>
              <CreditCard className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Salary</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(780000)}
                </p>
                <p className="text-xs text-gray-500 mt-1">this year</p>
              </div>
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Select
              value={filters.year}
              onChange={(e) =>
                setFilters({ ...filters, year: Number(e.target.value), page: 1 })
              }
              options={[]}
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </Select>

            <Select
              value={filters.month || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  month: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
              options={[]}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payroll History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Period
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Basic Salary
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Allowances
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Deductions
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Net Salary
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
                {payrollData.data.map((payroll) => (
                  <tr key={payroll._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {payroll.month} {payroll.year}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCurrency(payroll.basicSalary)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCurrency(payroll.hra + payroll.allowances)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCurrency(payroll.deductions)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payroll.netSalary)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(payroll.status)}>
                        {payroll.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost" title="Download Payslip">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payrollData.pagination && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <Pagination
                currentPage={payrollData.pagination.page}
                totalPages={payrollData.pagination.pages}
                onPageChange={(page) => setFilters({ ...filters, page })}
                totalItems={payrollData.pagination.total}
                itemsPerPage={payrollData.pagination.limit}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Salary Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Basic Salary</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(50000)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">HRA</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(15000)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Special Allowance</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(10000)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">PF Deduction</span>
                <span className="text-sm font-semibold text-red-600">
                  -{formatCurrency(3000)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tax Deduction</span>
                <span className="text-sm font-semibold text-red-600">
                  -{formatCurrency(2000)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 bg-primary-50 rounded-lg px-3 mt-4">
                <span className="text-base font-semibold text-gray-900">Net Salary</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(70000)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Tax Regime</p>
                <p className="text-base font-semibold text-gray-900">Old Tax Regime</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Annual Income</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(840000)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Tax Deducted</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(24000)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Tax Saving Investments</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(150000)}
                </p>
              </div>
              <Button variant="secondary" className="w-full mt-4">
                <FileText className="h-4 w-4 mr-2" />
                Download Form 16
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
