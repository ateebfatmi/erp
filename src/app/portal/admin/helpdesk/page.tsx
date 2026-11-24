import React from 'react';
import { LifeBuoy, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GrievanceManager } from '@/components/modules/communication/grievance-manager';

export default function AdminHelpdeskPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-indigo-600" />
            Parental Grievance Redressal Cell & Resolution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statutory parent dispute tracking, SLA breach management, direct escalation to Principal's office, and resolution record-keeping.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            CBSE Affiliation Bye-Laws Compliant
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <GrievanceManager role="admin" />
    </div>
  );
}
