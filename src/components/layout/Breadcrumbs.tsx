'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Auto-generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  // Remove 'dashboard' from segments if it's the first one
  if (segments[0] === 'dashboard') {
    segments.shift();
  }

  if (segments.length === 0) {
    return [{ label: 'Dashboard' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format label: 'employees-management' => 'Employees Management'
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Last segment should not be a link
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
