import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeacherDiaryManager } from '@/components/modules/academics/teacher-diary-manager';

export default function TeacherDiaryPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Weekly Classroom Teaching Diary & Logbook
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log period-by-period curriculum coverage, smart classroom aids, homework assignments, and individual student remediation notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            CBSE Statutory Diary
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Smt. Ananya Sen (PGT Math)
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <TeacherDiaryManager role="teacher" />
    </div>
  );
}
