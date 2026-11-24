import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResourceBookingManager } from '@/components/modules/facilities/resource-booking-manager';

export default function AdminFacilitiesDeskPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Campus Facility & Infrastructure Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise all school infrastructure bookings across ATL, labs, auditoriums, and arenas. Manage reservation conflicts and utilization logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Campus Oversight
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <ResourceBookingManager role="admin" />
    </div>
  );
}
