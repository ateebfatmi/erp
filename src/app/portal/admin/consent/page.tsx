import React from 'react';
import { CheckCircle2, ShieldCheck, Bus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ParentConsentManager } from '@/components/modules/communication/parent-consent-manager';

export default function AdminConsentPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Field Trip Consent Manifest & Safety Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise parental consent campaigns across all grades, track real-time boarding approval ratios, and generate statutory passenger manifests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Statutory Excursion Registry
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <ParentConsentManager role="admin" />
    </div>
  );
}
