'use client';

import React, { useState } from 'react';
import { HeartHandshake, FileCheck, Building, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CwsnIepManager } from '@/components/modules/academics/cwsn-iep-manager';
import { InclusiveResourceRoomManager } from '@/components/modules/academics/inclusive-resource-room-manager';

export default function AdminCwsnPage() {
  const [activeDesk, setActiveDesk] = useState<'iep' | 'resourceroom'>('iep');

  return (
    <div className="space-y-6">
      {/* Top Desk Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Inclusive Education, IEPs & Multi-Disciplinary Resource Room
            </h1>
            <p className="text-xs text-slate-500">
              CBSE Affiliation By-Laws Appendix IX, RPwD Act 2016, and Rehabilitation Council of India (RCI) Standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveDesk('iep')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeDesk === 'iep'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            IEP & Board Concessions
          </button>
          <button
            onClick={() => setActiveDesk('resourceroom')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeDesk === 'resourceroom'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Therapy & Resource Room
          </button>
        </div>
      </div>

      {activeDesk === 'iep' ? (
        <CwsnIepManager role="admin" />
      ) : (
        <InclusiveResourceRoomManager role="admin" />
      )}
    </div>
  );
}
