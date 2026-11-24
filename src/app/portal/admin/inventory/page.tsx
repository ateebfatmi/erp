import React from 'react';
import { Boxes, ShieldCheck, Download, Plus } from 'lucide-react';
import { InventoryManager } from '@/components/modules/inventory/inventory-manager';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            Institutional Inventory & Asset Depreciation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with Companies Act 2013 (Schedule II) & Indian IT Rules. Track straight-line & written down value assets, manage buffer stocks, and automate purchase orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export Asset Register (Excel)
          </Button>
        </div>
      </div>

      {/* Main Interactive Inventory & Depreciation Suite */}
      <InventoryManager />
    </div>
  );
}
