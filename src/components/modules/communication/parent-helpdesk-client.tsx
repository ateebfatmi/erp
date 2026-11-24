'use client';

import React, { useState } from 'react';
import { LifeBuoy, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GrievanceManager } from './grievance-manager';
import { PocsoSafetyManager } from '../security/pocso-safety-manager';

export function ParentHelpdeskClient() {
  const [activeTab, setActiveTab] = useState<'grievance' | 'pocso-safety'>('grievance');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-indigo-600" />
            Parent Grievance Redressal & Child Protection Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official statutory forum for resolution of academic, fee, and transport concerns, alongside the CBSE POCSO Child Protection Committee.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            48-Hour SLA Guaranteed
          </Badge>
          <Badge className="bg-rose-100 text-rose-800 border-rose-200">
            POCSO Compliant
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('grievance')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'grievance'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <LifeBuoy className="h-4 w-4" />
          General Grievances (Academics / Fees / Transport)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pocso-safety')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pocso-safety'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Child Protection Committee (CPC) & Safety Concerns
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            Confidential
          </span>
        </button>
      </div>

      {activeTab === 'grievance' ? (
        <GrievanceManager role="parent" />
      ) : (
        <PocsoSafetyManager role="parent" />
      )}
    </div>
  );
}
