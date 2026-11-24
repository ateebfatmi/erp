import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentStreamSelector } from '@/components/modules/academics/student-stream-selector';

export default function StudentCareerPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-600" />
            Senior Secondary Subject Streams & Career Pathways
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            NEP 2020 multidisciplinary course baskets, cut-off eligibility evaluations, and competitive entrance exam roadmaps (JEE, NEET, CUET, CLAT).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            NEP 2020 Framework
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StudentStreamSelector />
    </div>
  );
}
