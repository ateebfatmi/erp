import React from 'react';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SyllabusManager } from '@/components/modules/academics/syllabus-manager';

export default function TeacherSyllabusPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            CBSE Syllabus Progression & Digital Teaching Diary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track period-wise curriculum completion velocity, monitor lagging unit milestones, and draft NEP 2020 competency-aligned lesson plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            NEP 2020 Experiential Format
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Term 1 & 2 Aligned
          </Badge>
        </div>
      </div>

      {/* Main Interactive Syllabus & Lesson Plan Suite */}
      <SyllabusManager role="teacher" />
    </div>
  );
}
