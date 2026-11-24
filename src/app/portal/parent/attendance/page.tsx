import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { ParentLeaveManager } from '@/components/modules/attendance/parent-leave-manager';

export default function ParentAttendancePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Student Attendance & Digital Leave Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric attendance tracking, CBSE Rule 13 (75% compulsory attendance) monitoring, and direct leave application desk.
          </p>
        </div>
      </div>

      {/* Main Interactive Parent Leave & Attendance Suite */}
      <ParentLeaveManager />
    </div>
  );
}
