'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate } from '@/lib/utils';

type TabType = 'personal' | 'professional' | 'documents' | 'attendance' | 'leaves' | 'payroll';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const employeeId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // Fetch employee details
  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => userService.getUserById(employeeId),
  });

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Info', icon: UserIcon },
    { id: 'professional' as TabType, label: 'Professional', icon: Briefcase },
    { id: 'documents' as TabType, label: 'Documents', icon: FileText },
    { id: 'attendance' as TabType, label: 'Attendance', icon: Clock },
    { id: 'leaves' as TabType, label: 'Leaves', icon: Calendar },
    { id: 'payroll' as TabType, label: 'Payroll', icon: DollarSign },
  ];

  if (isLoading) return <PageLoader />;
  if (!employee) return <div>Employee not found</div>;

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Breadcrumbs
            items={[
              { label: 'Employees', href: '/employees' },
              { label: employee.fullName },
            ]}
          />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-bold text-2xl">
                {employee.fullName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.fullName}
              </h1>
              <p className="text-gray-600 mt-1">{employee.designation}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={getStatusColor(employee.status)}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-600">
                  ID: {employee.employeeCode}
                </span>
                <span className="text-sm text-gray-600">
                  Joined: {employee.joiningDate ? formatDate(employee.joiningDate) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {hasPermission('users:update') && (
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={() => router.push(`/employees/${employeeId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {hasPermission('users:delete') && (
                <Button variant="danger">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {employee.department}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-primary-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Employee Type</p>
              <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                {employee.employeeType?.replace('_', ' ')}
              </p>
            </div>
            <UserIcon className="h-8 w-8 text-primary-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reporting To</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {employee.reportingManager || 'N/A'}
              </p>
            </div>
            <UserIcon className="h-8 w-8 text-primary-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Organization</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {employee.organization}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-primary-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'personal' && <PersonalTab employee={employee} />}
        {activeTab === 'professional' && <ProfessionalTab employee={employee} />}
        {activeTab === 'documents' && <DocumentsTab employeeId={employeeId} />}
        {activeTab === 'attendance' && <AttendanceTab employeeId={employeeId} />}
        {activeTab === 'leaves' && <LeavesTab employeeId={employeeId} />}
        {activeTab === 'payroll' && <PayrollTab employeeId={employeeId} />}
      </div>
    </div>
  );
}

// Personal Tab Component
function PersonalTab({ employee }: { employee: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900 font-medium">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-900 font-medium">
                {employee.profile?.personalDetails?.phone || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-900 font-medium">
                {employee.profile?.personalDetails?.address || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="text-gray-900 font-medium">
                {employee.profile?.personalDetails?.dateOfBirth
                  ? formatDate(employee.profile.personalDetails.dateOfBirth)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {employee.profile?.personalDetails && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-gray-900 font-medium capitalize">
                {employee.profile.personalDetails.gender || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Marital Status</p>
              <p className="text-gray-900 font-medium capitalize">
                {employee.profile.personalDetails.maritalStatus || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="text-gray-900 font-medium">
                {employee.profile.personalDetails.nationality || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="text-gray-900 font-medium">
                {employee.profile.personalDetails.bloodGroup || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Professional Tab Component
function ProfessionalTab({ employee }: { employee: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Employee ID</p>
            <p className="text-gray-900 font-medium">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Joining Date</p>
            <p className="text-gray-900 font-medium">
              {formatDate(employee.joiningDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="text-gray-900 font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Designation</p>
            <p className="text-gray-900 font-medium">{employee.designation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employee Type</p>
            <p className="text-gray-900 font-medium capitalize">
              {employee.employeeType.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Work Location</p>
            <p className="text-gray-900 font-medium">{employee.workLocation}</p>
          </div>
        </div>
      </div>

      {employee.salaryStructure && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Salary Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Basic Salary</p>
              <p className="text-gray-900 font-medium">
                ${employee.salaryStructure.basicSalary?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total CTC</p>
              <p className="text-gray-900 font-medium">
                ${(employee.salaryStructure.basicSalary || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({ employeeId }: { employeeId: string }) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Documents Module
      </h3>
      <p className="text-gray-600">
        Document management will be implemented in the next phase
      </p>
    </div>
  );
}

// Attendance Tab Component
function AttendanceTab({ employeeId }: { employeeId: string }) {
  return (
    <div className="text-center py-12">
      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Attendance History
      </h3>
      <p className="text-gray-600">
        Attendance records will be displayed here
      </p>
    </div>
  );
}

// Leaves Tab Component
function LeavesTab({ employeeId }: { employeeId: string }) {
  return (
    <div className="text-center py-12">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Leave History
      </h3>
      <p className="text-gray-600">
        Leave records will be displayed here
      </p>
    </div>
  );
}

// Payroll Tab Component
function PayrollTab({ employeeId }: { employeeId: string }) {
  return (
    <div className="text-center py-12">
      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Payroll History
      </h3>
      <p className="text-gray-600">
        Payroll records will be displayed here
      </p>
    </div>
  );
}
