import React from 'react';
import { Users } from 'lucide-react';
import { PtmScheduler } from '@/components/modules/academics/ptm-scheduler';

export default function TeacherPtmPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Teacher PTM Consultation Schedule & Parent Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review confirmed parent appointment slots, manage consultation timelines, and record meeting feedback and action items.
          </p>
        </div>
      </div>

      <PtmScheduler role="teacher" />
    </div>
  );
}
