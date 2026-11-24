'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Brain, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentStreamSelector } from '@/components/modules/academics/student-stream-selector';
import { CareerCounselingManager } from '@/components/modules/academics/career-counseling-manager';

export default function StudentCareerPage() {
  const [activeView, setActiveView] = useState<'guidance' | 'streams'>('guidance');

  return (
    <div className="space-y-6">
      {/* Top Selector Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Career Exploration, RIASEC Profiling & Stream Pathways
            </h1>
            <p className="text-xs text-slate-500">
              Holistic career development aligned with NEP 2020 Clause 4.38 and CBSE Secondary Guidance Framework.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('guidance')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeView === 'guidance'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            RIASEC & CUET Guidance
          </button>
          <button
            onClick={() => setActiveView('streams')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeView === 'streams'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Subject Stream Baskets
          </button>
        </div>
      </div>

      {/* Conditional Active View */}
      {activeView === 'guidance' ? (
        <CareerCounselingManager role="student" />
      ) : (
        <StudentStreamSelector />
      )}
    </div>
  );
}
