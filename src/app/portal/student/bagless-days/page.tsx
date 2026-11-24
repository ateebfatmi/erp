import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaglessDaysManager } from '@/components/modules/academics/bagless-days-manager';

export default function StudentBaglessDaysPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            My 10 Bagless Days & Vocational Skill Badges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore hands-on vocational workshops in pottery, woodcraft, organic farming, robotics, and view your verified skill credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            Class 6-A Vocational Track
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <BaglessDaysManager role="student" />
    </div>
  );
}
