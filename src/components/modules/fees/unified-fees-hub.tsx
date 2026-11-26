'use client';

import React, { useState } from 'react';
import { CreditCard, Percent, Scale, Receipt, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { FeeConcessionsManager } from '@/components/modules/fees/fee-concessions-manager';
import { DoubleEntryLedgerViewer } from '@/components/modules/accounting/ledger-viewer';

interface UnifiedFeesHubProps {
  initialTab?: 'collections' | 'concessions' | 'ledger';
  collectionsContent: React.ReactNode;
}

export function UnifiedFeesHub({
  initialTab = 'collections',
  collectionsContent,
}: UnifiedFeesHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs: SubTabItem[] = [
    { id: 'collections', label: 'Collections & Cashier Counter', icon: CreditCard },
    { id: 'concessions', label: 'Concessions & Scholarships', icon: Percent },
    { id: 'ledger', label: 'Double-Entry Ledger & Tally', icon: Scale },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Institutional Fee Management & Accounting Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated double-entry fee allocations, statutory concession waivers (CBSE Udaan/EWS), online payments, and Tally Prime XML synchronization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            CAG Audit Ready
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
            Double-Entry General Ledger
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

      {/* Conditional View */}
      {activeTab === 'collections' && <div>{collectionsContent}</div>}

      {activeTab === 'concessions' && (
        <div>
          <FeeConcessionsManager viewMode="admin" />
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="pt-2">
          <DoubleEntryLedgerViewer />
        </div>
      )}
    </div>
  );
}
