import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CanteenManager } from '@/components/modules/facilities/canteen-manager';

export default function ParentCanteenPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Smart ID Card Canteen Wallet & Nutrition Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your ward’s cashless canteen balance, configure daily expenditure limits, view itemized receipts, and set allergen health safety guardrails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            RFID Smart Card Enabled
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <CanteenManager role="parent" />
    </div>
  );
}
