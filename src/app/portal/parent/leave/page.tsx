import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ParentLeaveManager } from '@/components/modules/attendance/parent-leave-manager';

export default function ParentLeavePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Student Absence & Leave Application Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply for medical and casual leaves for your ward, track approval status, and monitor CBSE Rule 13 minimum 75% examination eligibility in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            CBSE Rule 13 Protected
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <ParentLeaveManager />
    </div>
  );
}
