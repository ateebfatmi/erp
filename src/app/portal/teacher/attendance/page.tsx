import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { TeacherAttendanceManager } from '@/components/modules/attendance/teacher-attendance-manager';

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            Class Attendance Muster & Leave Authorization Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section-level daily roll call, automated parent leave sanctioning, and real-time attendance SMS dispatch.
          </p>
        </div>
      </div>

      {/* Main Interactive Teacher Muster Roll & Leave Inbox */}
      <TeacherAttendanceManager />
    </div>
  );
}
