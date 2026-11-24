import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MOCK_TENANT } from '@/lib/database/mock-data';

interface PortalShellProps {
  children: React.ReactNode;
  currentRole?: string;
  userName?: string;
}

export function PortalShell({
  children,
  currentRole = 'school_admin',
  userName = 'Shri Vikramaditya (Admin)',
}: PortalShellProps) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* Role-Aware Sidebar */}
      <Sidebar
        currentRole={currentRole}
        tenantName={MOCK_TENANT.name}
        affiliation={MOCK_TENANT.affiliation}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <React.Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
          <Header currentRole={currentRole} userName={userName} />
        </React.Suspense>
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
