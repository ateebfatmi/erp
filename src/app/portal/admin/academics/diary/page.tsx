import React from 'react';
import { BookOpen, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeacherDiaryManager } from '@/components/modules/academics/teacher-diary-manager';

export default function AdminTeacherDiaryPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Faculty Teaching Diaries & Academic Supervision Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review weekly lesson execution records, pedagogy quality, homework loads, and issue digital supervisory endorsements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Principal Audit Desk
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <TeacherDiaryManager role="admin" />
    </div>
  );
}
