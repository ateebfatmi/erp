import React from 'react';
import { Award, GraduationCap } from 'lucide-react';
import { CbseReportCardView } from '@/components/modules/assessment/cbse-report-card-view';

export default function StudentResultsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            My Academic Results & CBSE Report Card
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your board exam scores, periodic tests, grade points, class rank, and download your official report card.
          </p>
        </div>
      </div>

      {/* Main Interactive Holistic Progress Card */}
      <CbseReportCardView role="student" />
    </div>
  );
}
