import React from 'react';
import { Bell, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NoticeboardManager } from '@/components/modules/communication/noticeboard-manager';

export default function StudentNoticesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            School Circulars, Exam Dates & Activities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay informed on pre-board datesheets, sports trial announcements, holiday breaks, and campus events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            Class 12-A • Roll No. 24
          </Badge>
        </div>
      </div>

      {/* Noticeboard for Class 12 Student */}
      <NoticeboardManager role="student" studentGrade={12} />
    </div>
  );
}
