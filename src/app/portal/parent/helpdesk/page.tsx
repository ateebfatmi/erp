import React from 'react';
import { LifeBuoy, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GrievanceManager } from '@/components/modules/communication/grievance-manager';

export default function ParentHelpdeskPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-indigo-600" />
            Statutory Parent Grievance Redressal & Helpdesk Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lodge official inquiries or grievances regarding transport, academics, fees, and safety with mandatory 48-hour resolution tracking under CBSE Bye-Laws.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            48-Hour SLA Guaranteed
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <GrievanceManager role="parent" />
    </div>
  );
}
