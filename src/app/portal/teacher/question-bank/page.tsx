import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionBankManager } from '@/components/modules/assessment/question-bank-manager';

export default function TeacherQuestionBankPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            CBSE Examination Question Bank & Paper Composer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse standardized questions with marking schemes, contribute questions, and compile section-wise periodic test papers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Bloom's Taxonomy Framework
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <QuestionBankManager />
    </div>
  );
}
