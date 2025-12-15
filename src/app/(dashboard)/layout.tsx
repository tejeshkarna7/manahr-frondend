'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <FullPageLoader />;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return <FullPageLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
