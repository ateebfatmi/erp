'use client';

import React, { useState } from 'react';
import { Boxes, Package, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { InventoryManager } from '@/components/modules/inventory/inventory-manager';
import { StockRequisitionManager } from '@/components/modules/inventory/stock-requisition-manager';
import { SchoolStoreManager } from '@/components/modules/inventory/school-store-manager';

interface UnifiedInventoryHubProps {
  initialTab?: 'assets' | 'requisitions' | 'store';
}

export function UnifiedInventoryHub({ initialTab = 'assets' }: UnifiedInventoryHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs: SubTabItem[] = [
    { id: 'assets', label: 'Institutional Assets & Depreciation', icon: Boxes },
    { id: 'requisitions', label: 'Departmental Indents & Requisitions', icon: Package },
    { id: 'store', label: 'Campus Uniform & Bookstore POS', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            Central Campus Inventory & Procurement Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional fixed asset registers, straight-line/WDV depreciation schedules, store issue vouchers, and student bookstore POS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            CAG Audit Compliant
          </Badge>
        </div>
      </div>

      {/* SubTabBar Navigation */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
        variant="pills"
      />

      {/* Tab Panels */}
      {activeTab === 'assets' && <InventoryManager />}

      {activeTab === 'requisitions' && <StockRequisitionManager role="admin" />}

      {activeTab === 'store' && <SchoolStoreManager viewMode="admin" />}
    </div>
  );
}
