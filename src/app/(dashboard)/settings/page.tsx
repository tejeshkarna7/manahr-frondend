'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  Building2,
  Clock,
  Calendar,
  Mail,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

type SettingsTab = 'company' | 'attendance' | 'leave' | 'notifications' | 'security';

export default function SettingsPage() {
  const { user, hasPermission } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');

  // const canManage = hasPermission('settings:manage') || hasPermission('settings:configure');
  const canManage = true;

  const tabs = [
    { id: 'company' as SettingsTab, label: 'Company', icon: Building2 },
    { id: 'attendance' as SettingsTab, label: 'Attendance', icon: Clock },
    { id: 'leave' as SettingsTab, label: 'Leave', icon: Calendar },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  ];

  const { register, handleSubmit } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast.success('Settings saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  if (!canManage) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to access settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your organization settings</p>
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
                ${activeTab === tab.id
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === 'company' && <CompanySettings register={register} />}
        {activeTab === 'attendance' && <AttendanceSettings register={register} />}
        {activeTab === 'leave' && <LeaveSettings register={register} />}
        {activeTab === 'notifications' && <NotificationSettings register={register} />}
        {activeTab === 'security' && <SecuritySettings register={register} />}

        {/* Save Button */}
        <div className="flex items-center justify-end pt-6">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CompanySettings({ register }: { register: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            defaultValue="ManaHR Technologies"
            {...register('companyName')}
          />
          <Input
            label="Organization Code"
            defaultValue="MANA001"
            disabled
            {...register('organizationCode')}
          />
          <Input
            label="Email"
            type="email"
            defaultValue="info@manahr.com"
            {...register('email')}
          />
          <Input
            label="Phone"
            defaultValue="+91 1234567890"
            {...register('phone')}
          />
          <Input
            label="Address"
            defaultValue="123 Business Park"
            {...register('address')}
          />
          <Input
            label="City"
            defaultValue="Bangalore"
            {...register('city')}
          />
          <Input
            label="State"
            defaultValue="Karnataka"
            {...register('state')}
          />
          <Input
            label="Pincode"
            defaultValue="560001"
            {...register('pincode')}
          />
          <Select label="Country" defaultValue="IN" {...register('country')}>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </Select>
          <Select label="Timezone" defaultValue="Asia/Kolkata" {...register('timezone')}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceSettings({ register }: { register: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Work Start Time"
              type="time"
              defaultValue="09:00"
              {...register('workStartTime')}
            />
            <Input
              label="Work End Time"
              type="time"
              defaultValue="18:00"
              {...register('workEndTime')}
            />
            <Input
              label="Late Mark Threshold (minutes)"
              type="number"
              defaultValue="15"
              {...register('lateThreshold')}
            />
            <Input
              label="Half Day Hours"
              type="number"
              step="0.5"
              defaultValue="4"
              {...register('halfDayHours')}
            />
            <Input
              label="Full Day Hours"
              type="number"
              step="0.5"
              defaultValue="8"
              {...register('fullDayHours')}
            />
            <Select label="Auto Checkout" defaultValue="yes" {...register('autoCheckout')}>
              <option value="yes">Enabled</option>
              <option value="no">Disabled</option>
            </Select>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Options</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('enableLocationTracking')}
                />
                <span className="text-sm text-gray-700">Enable location tracking</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('enableBiometric')}
                />
                <span className="text-sm text-gray-700">Enable biometric authentication</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  {...register('allowManualMarking')}
                />
                <span className="text-sm text-gray-700">Allow manual attendance marking</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveSettings({ register }: { register: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Annual Leave Days"
              type="number"
              defaultValue="21"
              {...register('annualLeaveDays')}
            />
            <Input
              label="Sick Leave Days"
              type="number"
              defaultValue="12"
              {...register('sickLeaveDays')}
            />
            <Input
              label="Casual Leave Days"
              type="number"
              defaultValue="10"
              {...register('casualLeaveDays')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Leave Policies</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('carryForward')}
                />
                <span className="text-sm text-gray-700">Allow leave carry forward</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('encashment')}
                />
                <span className="text-sm text-gray-700">Enable leave encashment</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  {...register('requireApproval')}
                />
                <span className="text-sm text-gray-700">Require manager approval</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSettings({ register }: { register: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Email Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('emailLeaveRequest')}
                />
                <span className="text-sm text-gray-700">Leave requests</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('emailAttendance')}
                />
                <span className="text-sm text-gray-700">Attendance alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  {...register('emailPayroll')}
                />
                <span className="text-sm text-gray-700">Payroll updates</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">In-App Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('inAppLeave')}
                />
                <span className="text-sm text-gray-700">Leave approvals</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('inAppAnnouncements')}
                />
                <span className="text-sm text-gray-700">System announcements</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings({ register }: { register: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              defaultValue="30"
              {...register('sessionTimeout')}
            />
            <Input
              label="Password Expiry (days)"
              type="number"
              defaultValue="90"
              {...register('passwordExpiry')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Password Policy</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('requireUppercase')}
                />
                <span className="text-sm text-gray-700">Require uppercase letters</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('requireNumbers')}
                />
                <span className="text-sm text-gray-700">Require numbers</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                  {...register('requireSpecialChars')}
                />
                <span className="text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                {...register('enable2FA')}
              />
              <span className="text-sm text-gray-700">Enable 2FA for all users</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
