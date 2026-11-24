'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Bell, CalendarDays, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentRole: string;
  userName: string;
}

export function Header({ currentRole, userName }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Switch role preview mode via URL query parameter
  const handleRoleChange = (newRole: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', newRole);

    let targetRoute = '/portal/admin';
    if (newRole === 'teacher') targetRoute = '/portal/teacher';
    if (newRole === 'parent') targetRoute = '/portal/parent';
    if (newRole === 'student') targetRoute = '/portal/student';
    if (newRole === 'platform_super_admin') targetRoute = '/platform';

    router.push(`${targetRoute}?${params.toString()}`);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search students, staff, admission leads, fee receipts (Ctrl+K)..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Academic Session Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
          <span>AY 2025-2026</span>
        </div>

        {/* Rapid Portal & Role Switcher */}
        <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-200 rounded-lg px-2 py-1 text-xs text-blue-900">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-medium text-[11px] hidden md:inline">Portal View:</span>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-transparent font-semibold text-blue-800 text-xs cursor-pointer focus:outline-none"
          >
            <option value="school_admin">School Admin</option>
            <option value="teacher">Teacher Portal</option>
            <option value="parent">Parent Portal</option>
            <option value="student">Student Portal</option>
            <option value="platform_super_admin">Platform Super Admin</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 relative cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        {/* User Identity Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
            {userName ? userName.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
