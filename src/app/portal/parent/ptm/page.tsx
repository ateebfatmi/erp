import React from 'react';
import { Users } from 'lucide-react';
import { PtmScheduler } from '@/components/modules/academics/ptm-scheduler';

export default function ParentPtmPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Parent-Teacher Meeting (PTM) Appointment Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Book 15-minute one-on-one consultation slots with subject educators and class teachers. Real-time conflict protection and agenda logging.
          </p>
        </div>
      </div>

      <PtmScheduler role="parent" />
    </div>
  );
}
