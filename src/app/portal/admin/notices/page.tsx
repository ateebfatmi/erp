import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NoticeboardManager } from '@/components/modules/communication/noticeboard-manager';

export default function AdminNoticesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Official Circulars & Academic Calendar Management Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and broadcast statutory CBSE circulars, configure the institutional academic calendar, and monitor digital parent acknowledgement receipts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            CBSE Pariksha Sangam LOC Aligned
          </Badge>
        </div>
      </div>

      {/* Noticeboard Management Suite */}
      <NoticeboardManager role="admin" />
    </div>
  );
}
