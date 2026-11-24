import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HolisticProgressManager } from '@/components/modules/assessment/holistic-progress-manager';

export default function TeacherHpcPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            NEP 2020 360° Holistic Progress Card (HPC) Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            PARAKH framework assessment synthesizing Learner Self-Reflection, Peer Assessment, Class Teacher Anecdotal Records, and Parent Observations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <Award className="h-3 w-3" />
            PARAKH Certified
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HolisticProgressManager role="teacher" />
    </div>
  );
}
