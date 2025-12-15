'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { userService } from '@/services/user.service';
import { EmployeeType, Gender } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

// Validation Schema
const employeeSchema = z.object({
  // Basic Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  
  // Employment Details
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employeeType: z.enum(['full_time', 'part_time', 'contract', 'intern']),
  joiningDate: z.string().min(1, 'Joining date is required'),
  workLocation: z.string().min(1, 'Work location is required'),
  reportingTo: z.string().optional(),
  
  // Personal Details
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  
  // Salary Details
  basicSalary: z.number().min(0, 'Basic salary must be positive').optional(),
  hra: z.number().min(0).optional(),
  specialAllowance: z.number().min(0).optional(),
  
  // Bank Details
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  panNumber: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'basic' | 'personal' | 'salary' | 'bank'>('basic');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeType: 'full_time',
      gender: 'male',
      maritalStatus: 'single',
    },
  });

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => userService.createUser(data),
    onSuccess: () => {
      toast.success('Employee created successfully!');
      router.push('/employees');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create employee');
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    // Transform form data to match API structure
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      employeeId: data.employeeId,
      department: data.department,
      designation: data.designation,
      employeeType: data.employeeType,
      joiningDate: data.joiningDate,
      workLocation: data.workLocation,
      reportingTo: data.reportingTo,
      profile: {
        personalDetails: {
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          nationality: data.nationality,
          bloodGroup: data.bloodGroup,
        },
      },
      salaryStructure: {
        basicSalary: data.basicSalary,
        hra: data.hra,
        specialAllowance: data.specialAllowance,
      },
      bankDetails: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        panNumber: data.panNumber,
      },
    };

    createMutation.mutate(payload);
  };

  const sections = [
    { id: 'basic' as const, label: 'Basic Info', icon: User },
    { id: 'personal' as const, label: 'Personal Details', icon: MapPin },
    { id: 'salary' as const, label: 'Salary', icon: DollarSign },
    { id: 'bank' as const, label: 'Bank Details', icon: Briefcase },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Breadcrumbs
            items={[
              { label: 'Employees', href: '/employees' },
              { label: 'Add New Employee' },
            ]}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-600 mt-1">
          Fill in the employee details below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Navigation */}
        <Card>
          <div className="flex space-x-4 p-4 border-b border-gray-200 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors
                  ${
                    activeSection === section.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          <CardContent className="p-6">
            {/* Basic Information */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    required
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Password"
                    type="password"
                    required
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <Input
                    label="Employee ID"
                    required
                    error={errors.employeeId?.message}
                    {...register('employeeId')}
                  />
                  <Input
                    label="Department"
                    required
                    error={errors.department?.message}
                    {...register('department')}
                  />
                  <Input
                    label="Designation"
                    required
                    error={errors.designation?.message}
                    {...register('designation')}
                  />
                  <Select
                    label="Employee Type"
                    required
                    error={errors.employeeType?.message}
                    {...register('employeeType')}
                    options={[]}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </Select>
                  <Input
                    label="Joining Date"
                    type="date"
                    required
                    error={errors.joiningDate?.message}
                    {...register('joiningDate')}
                  />
                  <Input
                    label="Work Location"
                    required
                    error={errors.workLocation?.message}
                    {...register('workLocation')}
                  />
                  <Input
                    label="Reporting To"
                    error={errors.reportingTo?.message}
                    {...register('reportingTo')}
                  />
                </div>
              </div>
            )}

            {/* Personal Details */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    error={errors.dateOfBirth?.message}
                    {...register('dateOfBirth')}
                  />
                  <Select
                    label="Gender"
                    error={errors.gender?.message}
                    {...register('gender')}
                    options={[]}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                  <Select
                    label="Marital Status"
                    error={errors.maritalStatus?.message}
                    {...register('maritalStatus')}
                    options={[]}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </Select>
                  <Input
                    label="Address"
                    error={errors.address?.message}
                    {...register('address')}
                  />
                  <Input
                    label="City"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    label="State"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <Input
                    label="Pincode"
                    error={errors.pincode?.message}
                    {...register('pincode')}
                  />
                  <Input
                    label="Nationality"
                    error={errors.nationality?.message}
                    {...register('nationality')}
                  />
                  <Input
                    label="Blood Group"
                    error={errors.bloodGroup?.message}
                    {...register('bloodGroup')}
                  />
                </div>
              </div>
            )}

            {/* Salary Details */}
            {activeSection === 'salary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Basic Salary"
                    type="number"
                    error={errors.basicSalary?.message}
                    {...register('basicSalary', { valueAsNumber: true })}
                  />
                  <Input
                    label="HRA"
                    type="number"
                    error={errors.hra?.message}
                    {...register('hra', { valueAsNumber: true })}
                  />
                  <Input
                    label="Special Allowance"
                    type="number"
                    error={errors.specialAllowance?.message}
                    {...register('specialAllowance', { valueAsNumber: true })}
                  />
                </div>
              </div>
            )}

            {/* Bank Details */}
            {activeSection === 'bank' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Bank Name"
                    error={errors.bankName?.message}
                    {...register('bankName')}
                  />
                  <Input
                    label="Account Number"
                    error={errors.accountNumber?.message}
                    {...register('accountNumber')}
                  />
                  <Input
                    label="IFSC Code"
                    error={errors.ifscCode?.message}
                    {...register('ifscCode')}
                  />
                  <Input
                    label="PAN Number"
                    error={errors.panNumber?.message}
                    {...register('panNumber')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Employee
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
