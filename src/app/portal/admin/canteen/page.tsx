import React from 'react';
import { UtensilsCrossed, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CanteenManager } from '@/components/modules/facilities/canteen-manager';

export default function AdminCanteenPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
            Campus Canteen Operations & Cashless POS Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rapid RFID tap checkout, student meal token dispensing, nutritional calorie compliance, and live daily sales auditing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            FSSAI Healthy Canteen Aligned
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <CanteenManager role="admin" />
    </div>
  );
}
