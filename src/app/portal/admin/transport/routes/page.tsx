import React from 'react';
import { Bus, MapPin, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BusRoutesManager } from '@/components/modules/transport/bus-routes-manager';

export default function AdminBusRoutesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="h-5 w-5 text-amber-600" />
            Bus Routes, Stop Timetables & Distance Fee Slabs Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure designated bus stops, morning pick-up & afternoon drop timetables, Supreme Court seating capacity compliance, and distance-based fee billing tiers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Supreme Court Safety Verified
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <BusRoutesManager />
    </div>
  );
}
