import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HolisticProgressManager } from '@/components/modules/assessment/holistic-progress-manager';

export default function StudentHpcPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            My 360° Holistic Progress Card (HPC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit your self-reflection voice, review peer appreciation, and track your 21st-century critical thinking and creative competency levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <Award className="h-3 w-3" />
            NEP 2020 Multi-Dimensional
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HolisticProgressManager role="student" />
    </div>
  );
}
