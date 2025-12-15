'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: undefined as string | undefined,
  });

  // Mock documents data
  const documentsData = {
    data: [
      {
        _id: '1',
        name: 'Offer Letter.pdf',
        category: 'Employment',
        size: 245760,
        uploadedAt: '2025-01-01',
        uploadedBy: 'HR Admin',
      },
      {
        _id: '2',
        name: 'ID Proof - Aadhaar.pdf',
        category: 'Identity',
        size: 512000,
        uploadedAt: '2025-01-05',
        uploadedBy: 'John Doe',
      },
      {
        _id: '3',
        name: 'Educational Certificate.pdf',
        category: 'Education',
        size: 1024000,
        uploadedAt: '2025-01-10',
        uploadedBy: 'John Doe',
      },
    ],
    pagination: {
      page: 1,
      pages: 1,
      total: 3,
      limit: 10,
    },
  };

  const isLoading = false;

  const { register, handleSubmit, reset } = useForm();

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully!');
      setIsUploadModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Failed to upload document');
    },
  });

  const onUpload = (data: any) => {
    uploadMutation.mutate(data);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Documents</h1>
          <p className="text-gray-600 mt-1">Manage your personal and work documents</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Employment Docs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <FileText className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Identity Docs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">6</p>
              </div>
              <FileText className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Other Docs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">10</p>
              </div>
              <FileText className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search documents..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>

            <Select
              value={filters.category || ''}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value || undefined, page: 1 })
              }
              options={[]}
            >
              <option value="">All Categories</option>
              <option value="employment">Employment</option>
              <option value="identity">Identity</option>
              <option value="education">Education</option>
              <option value="bank">Bank</option>
              <option value="tax">Tax</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentsData.data.map((doc) => (
          <Card key={doc._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="default">{doc.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Uploaded</span>
                  <span className="text-gray-900">{formatDate(doc.uploadedAt)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">By</span>
                  <span className="text-gray-900">{doc.uploadedBy}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {documentsData.data.length === 0 && (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No documents found"
          description="Upload your first document to get started"
          action={{
            label: 'Upload Document',
            onClick: () => setIsUploadModalOpen(true)
          }}
        />
      )}

      {/* Pagination */}
      {documentsData.pagination && documentsData.data.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={documentsData.pagination.page}
            totalPages={documentsData.pagination.pages}
            onPageChange={(page) => setFilters({ ...filters, page })}
            totalItems={documentsData.pagination.total}
            itemsPerPage={documentsData.pagination.limit}
          />
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
      >
        <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
          <Input label="Document Name" required {...register('name')} />

          <Select label="Category" required {...register('category')} options={[]}>
            <option value="">Select category</option>
            <option value="employment">Employment</option>
            <option value="identity">Identity</option>
            <option value="education">Education</option>
            <option value="bank">Bank</option>
            <option value="tax">Tax</option>
            <option value="other">Other</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                {...register('file')}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
