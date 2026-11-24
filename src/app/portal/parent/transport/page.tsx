import React from 'react';
import { Bus, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ParentTransportView } from '@/components/modules/transport/parent-transport-view';

export default function ParentTransportPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="h-5 w-5 text-blue-600" />
            Live School Bus Telematics & Ward Transit Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time AIS-140 GPS location, RFID boarding & deboarding verification, stop ETA countdown, and direct crew helpline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            AIS-140 Certified Vehicle
          </Badge>
        </div>
      </div>

      {/* Main Interactive Telematics View */}
      <ParentTransportView />
    </div>
  );
}
