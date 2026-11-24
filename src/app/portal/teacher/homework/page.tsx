import React from 'react';
import { FileText } from 'lucide-react';
import { HomeworkManager } from '@/components/modules/academics/homework-manager';

export default function TeacherHomeworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Classroom Homework & Assignment Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create subject tasks, attach guidelines, set deadlines, and grade student digital submissions.
          </p>
        </div>
      </div>

      {/* Main Interactive Homework Management Suite */}
      <HomeworkManager />
    </div>
  );
}
