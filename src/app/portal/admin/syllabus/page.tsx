import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SyllabusManager } from '@/components/modules/academics/syllabus-manager';

export default function AdminSyllabusPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Curriculum Oversight & Academic Audit Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional oversight of subject syllabi velocity, faculty lesson plan approvals, and pre-board readiness audit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Academic Council Monitored
          </Badge>
        </div>
      </div>

      {/* Main Interactive Syllabus & Lesson Plan Suite */}
      <SyllabusManager role="admin" />
    </div>
  );
}
