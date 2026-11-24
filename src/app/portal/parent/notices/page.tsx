import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NoticeboardManager } from '@/components/modules/communication/noticeboard-manager';

export default function ParentNoticesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            School Circulars & Statutory Notices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access official school notifications, exam schedules, gazetted holiday calendars, and digitally submit mandatory advisory acknowledgements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Aarav Mehta (Class 12-A)
          </Badge>
        </div>
      </div>

      {/* Noticeboard for Class 12 Parent */}
      <NoticeboardManager role="parent" studentGrade={12} />
    </div>
  );
}
