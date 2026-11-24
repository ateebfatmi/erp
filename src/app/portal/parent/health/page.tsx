import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentHealthManager } from '@/components/modules/health/student-health-manager';

export default function ParentHealthPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-600" />
            Child Medical & Health Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CBSE Health & Physical Activity Card records, infirmary OPD visits, allergy alerts, and sports exemption requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            School Clinic Connected
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StudentHealthManager role="parent" />
    </div>
  );
}
