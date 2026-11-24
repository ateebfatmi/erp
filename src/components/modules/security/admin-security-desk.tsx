'use client';

import React, { useState } from 'react';
import { DoorOpen, ShieldAlert } from 'lucide-react';
import { GatepassManager } from './gatepass-manager';
import { PocsoSafetyManager } from './pocso-safety-manager';

export function AdminSecurityDesk() {
  const [activeTab, setActiveTab] = useState<'gatepass' | 'pocso-safety'>('gatepass');

  return (
    <div className="space-y-6">
      {/* Top Tab Bar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('gatepass')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'gatepass'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <DoorOpen className="h-4 w-4" />
          Campus Gate Security & Visitor Gatepasses
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
          POCSO Child Protection & Safety Committee Desk
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            Mandatory
          </span>
        </button>
      </div>

      {activeTab === 'gatepass' ? (
        <GatepassManager />
      ) : (
        <PocsoSafetyManager role="admin" />
      )}
    </div>
  );
}
