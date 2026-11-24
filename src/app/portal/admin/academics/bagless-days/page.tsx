import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaglessDaysManager } from '@/components/modules/academics/bagless-days-manager';

export default function AdminBaglessDaysPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            NEP 2020 10 Bagless Days & Vocational Skill Hub (Grades 6–8)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional statutory tracking for CBSE 10 Bagless Days: pottery, woodcraft, organic farming, robotics, block printing, artisan partnerships, and skill portfolios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Statutory 60-Hour Mandate
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <BaglessDaysManager role="admin" />
    </div>
  );
}
