import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, FileText } from 'lucide-react';
import { CbtExamRunner } from '@/components/modules/assessment/cbt-exam-runner';
import { StudentAssignmentManager } from '@/components/modules/academics/student-assignment-manager';

export default function StudentHomeworkPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Digital Assignments, Homework & CBT Assessment Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit coursework solutions, access teacher instructions and evaluated feedback, and practice timed Computer-Based Tests (CBT).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Class 12-A • Science Stream
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Auto-Grading Live
          </Badge>
        </div>
      </div>

      {/* Coursework & Assignment Submissions */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Active Subject Assignments & Lab Coursework
        </h2>
        <StudentAssignmentManager />
      </div>

      {/* Online CBT Test Section */}
      <div className="pt-4 border-t border-slate-200">
        <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Scheduled Computer-Based Practice Exam (CBT)
        </h2>
        <CbtExamRunner />
      </div>
    </div>
  );
}
