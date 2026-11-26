'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Bell, CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Global Quick Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search students, staff, indents, fee ledgers..."
          className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-0.5">
          <kbd className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Academic Session Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-semibold text-slate-800">AY 2025-26</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Rapid Portal & Role Switcher */}
        <div className="flex items-center gap-1.5 bg-blue-50/90 border border-blue-200 rounded-xl px-2.5 py-1.5 text-xs text-blue-900 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="font-medium text-[11px] text-blue-700 hidden md:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-transparent font-bold text-blue-900 text-xs cursor-pointer focus:outline-none"
          >
            <option value="school_admin">School Admin</option>
            <option value="teacher">Teacher Portal</option>
            <option value="parent">Parent Portal</option>
            <option value="student">Student Portal</option>
            <option value="platform_super_admin">Platform Super Admin</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 relative cursor-pointer transition-colors shadow-2xs"
          title="Campus Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Identity Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-50">
            {userName ? userName.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {userName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 capitalize">
              {currentRole.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
