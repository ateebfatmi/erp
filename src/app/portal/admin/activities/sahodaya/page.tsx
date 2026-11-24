import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SahodayaManager } from '@/components/modules/activities/sahodaya-manager';

export default function AdminSahodayaPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            CBSE Sahodaya School Complex & Inter-School Delegation Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage cluster school competitions, parliamentary debates, MUNs, science exhibitions, off-campus student safety NOCs, and cluster trophy standings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            CBSE Safety Directive Compliant
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <SahodayaManager />
    </div>
  );
}
