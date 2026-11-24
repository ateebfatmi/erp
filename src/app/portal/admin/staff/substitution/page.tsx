import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubstitutionManager } from '@/components/modules/academics/substitution-manager';

export default function AdminSubstitutionPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Daily Teacher Arrangement & Substitution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic period substitution resolver for faculty absenteeism, free-period allocation, and statutory leave approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Automated Conflict Resolution
          </Badge>
        </div>
      </div>

      {/* Main Interactive Admin Substitution Suite */}
      <SubstitutionManager role="admin" />
    </div>
  );
}
