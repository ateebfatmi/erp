import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ParentConsentManager } from '@/components/modules/communication/parent-consent-manager';

export default function ParentConsentPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Digital Parental Consent & Excursions Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review upcoming educational field trips, sports camps, and medical screening drives. Authorize your ward's participation with verified digital consent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            POCSO & CBSE Safety Verified
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <ParentConsentManager role="parent" studentId="stu-01" />
    </div>
  );
}
