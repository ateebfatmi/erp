import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { CbseReportCardView } from '@/components/modules/assessment/cbse-report-card-view';

export default function ParentReportsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Student Academic Progress & Term Report Card
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official CBSE Term Evaluation, Scholastic 9-Point Grades, Co-Scholastic Assessments, and Principal Endorsement.
          </p>
        </div>
      </div>

      {/* Main Interactive Holistic Progress Card */}
      <CbseReportCardView role="parent" />
    </div>
  );
}
