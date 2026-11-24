import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HouseManager } from '@/components/modules/activities/house-manager';

export default function AdminActivitiesPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Inter-House Championship & Co-Curricular Activities Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee annual Cock House athletic meets, literary debates, science hackathons, Olympic medal tallies, and podium point awards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            4-House Statutory System
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HouseManager role="admin" />
    </div>
  );
}
