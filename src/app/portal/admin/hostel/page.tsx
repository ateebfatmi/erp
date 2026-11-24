import React from 'react';
import { Bed, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HostelManager } from '@/components/modules/facilities/hostel-manager';

export default function AdminHostelPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bed className="h-5 w-5 text-indigo-600" />
            Hostel & Residential Dormitory Management Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Residential wing allocations, room bed capacity tracking, 21:30 night curfew biometric roll call, and campus dining mess nutrition logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Residential Campus Wing
          </Badge>
        </div>
      </div>

      {/* Main Interactive Hostel Suite */}
      <HostelManager />
    </div>
  );
}
