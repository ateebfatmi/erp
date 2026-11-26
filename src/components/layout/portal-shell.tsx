'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MOCK_TENANT } from '@/lib/database/mock-data';
import { X } from 'lucide-react';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar
          currentRole={currentRole}
          tenantName={MOCK_TENANT.name}
          affiliation={MOCK_TENANT.affiliation}
        />
      </div>

      {/* 2. Mobile & Tablet Slide-Over Drawer Sheet */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Off-canvas Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* Close Button top-right of mobile drawer */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-3.5 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 z-30 transition-colors cursor-pointer"
              aria-label="Close Navigation Menu"
            >
              <X className="h-5 w-5" />
            </button>

            <Sidebar
              currentRole={currentRole}
              tenantName={MOCK_TENANT.name}
              affiliation={MOCK_TENANT.affiliation}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <React.Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
          <Header
            currentRole={currentRole}
            userName={userName}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          />
        </React.Suspense>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
