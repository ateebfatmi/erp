import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionBankManager } from '@/components/modules/assessment/question-bank-manager';

export default function AdminQuestionBankPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            CBSE Question Bank & Auto Exam Paper Blueprint Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional question repository categorized by Bloom’s Taxonomy, Section A-E blueprint compilation, and automated test paper generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            CBSE Circular Acad-05/2017 Aligned
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <QuestionBankManager />
    </div>
  );
}
