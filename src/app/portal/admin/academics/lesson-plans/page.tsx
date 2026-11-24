import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LessonPlanManager } from '@/components/modules/academics/lesson-plan-manager';

export default function AdminLessonPlansPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Academic HOD Lesson Plan Verification & NEP 2020 Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review faculty micro-plans, verify Bloom's Taxonomy cognitive distribution, monitor CBSE Art Integration compliance, and provide pedagogical feedback.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            HOD / Vice-Principal Desk
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <LessonPlanManager role="admin" />
    </div>
  );
}
