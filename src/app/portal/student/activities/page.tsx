import React from 'react';
import { Trophy, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HouseManager } from '@/components/modules/activities/house-manager';

export default function StudentActivitiesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Inter-House Championship & Co-Curricular Events
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Check your house championship standing, view upcoming sports and cultural event fixtures, and cheer on team representatives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Flag className="h-3.5 w-3.5" />
            Ashoka House
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HouseManager role="student" />
    </div>
  );
}
