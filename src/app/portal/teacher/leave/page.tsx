import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubstitutionManager } from '@/components/modules/academics/substitution-manager';

export default function TeacherLeavePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Faculty Leave Portal & Substitution Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply for statutory 7th CPC leaves (CL, EL, ML, OD), track approved quota balances, and review assigned peer lecture substitutions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            7th CPC Compliant
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Smt. Ananya Sen (PGT Math)
          </Badge>
        </div>
      </div>

      {/* Main Interactive Teacher Leave & Substitution Suite */}
      <SubstitutionManager role="teacher" currentTeacherId="tch-01" />
    </div>
  );
}
