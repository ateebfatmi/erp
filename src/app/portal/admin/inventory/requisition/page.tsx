import React from 'react';
import { Boxes, PackageCheck, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StockRequisitionManager } from '@/components/modules/inventory/stock-requisition-manager';

export default function AdminRequisitionPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            Central Store Indents Approval & Issue Voucher Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and sanction departmental material requisitions, generate store issue vouchers (SIV), and monitor safety buffer stocks across labs and academic cells.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Store Management Engine
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StockRequisitionManager role="admin" />
    </div>
  );
}
