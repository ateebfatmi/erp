import React from 'react';
import { Settings, ShieldCheck } from 'lucide-react';
import { SchoolSettingsManager } from '@/components/modules/settings/school-settings-manager';

export default function SchoolSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            Institutional Settings & Academic Session Rollover
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure CBSE/ICSE board affiliations, multi-campus branches, statutory promotion rollover, and automated ERP policies.
          </p>
        </div>
      </div>

      {/* Main Interactive Settings Suite */}
      <SchoolSettingsManager />
    </div>
  );
}
