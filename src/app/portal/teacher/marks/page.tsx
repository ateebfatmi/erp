import React from 'react';
import { Award, ShieldCheck, Download } from 'lucide-react';
import { TeacherMarksEntry } from '@/components/modules/assessment/teacher-marks-entry';

export default function TeacherMarksPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            CBSE Examination Marks & Internal Assessment Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grade 10-A &bull; Enter Periodic Tests, Portfolios, Practical Enrichment, and Annual Theory Marks with instant 9-point CBSE grading.
          </p>
        </div>
      </div>

      {/* Main Interactive Teacher Marks Entry Matrix */}
      <TeacherMarksEntry />
    </div>
  );
}
