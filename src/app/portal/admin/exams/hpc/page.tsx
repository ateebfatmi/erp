import React from 'react';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HolisticProgressManager } from '@/components/modules/assessment/holistic-progress-manager';

export default function AdminHpcPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            School-Wide Holistic Progress Card (HPC) & 360° Assessment Cell
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise PARAKH 360-degree assessment compliance across all classes, review anecdotal logs, and export standardized cards for CBSE statutory audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            PARAKH Quality Standard
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HolisticProgressManager role="admin" />
    </div>
  );
}
