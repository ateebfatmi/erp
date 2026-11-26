'use client';

import React, { useState } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  Trophy,
  HeartHandshake,
  Building,
  GraduationCap,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Badge } from '@/components/ui/badge';
import { TcRegistryManager } from '@/components/modules/students/tc-registry-manager';
import { NoDuesManager } from '@/components/modules/students/no-dues-manager';
import { DisciplineManager } from '@/components/modules/students/discipline-manager';
import { CwsnIepManager } from '@/components/modules/academics/cwsn-iep-manager';
import { InclusiveResourceRoomManager } from '@/components/modules/academics/inclusive-resource-room-manager';

export type StudentTabId =
  | 'directory'
  | 'tc'
  | 'clearance'
  | 'discipline'
  | 'cwsn'
  | 'resource-room';

interface UnifiedStudentsHubProps {
  initialTab?: StudentTabId;
  directoryContent?: React.ReactNode;
}

export function UnifiedStudentsHub({
  initialTab = 'directory',
  directoryContent,
}: UnifiedStudentsHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs: SubTabItem[] = [
    {
      id: 'directory',
      label: 'SIS Directory & Admissions',
      icon: Users,
      badge: 'Active SIS',
    },
    {
      id: 'tc',
      label: 'Transfer Certificate (TC) Desk',
      icon: FileText,
      badge: 'CBSE 20-Pt',
    },
    {
      id: 'clearance',
      label: 'No-Dues Clearance Matrix',
      icon: CheckCircle2,
      badge: 'Multi-Dept',
    },
    {
      id: 'discipline',
      label: 'Pastoral Care & Merits',
      icon: Trophy,
      badge: 'Merits',
    },
    {
      id: 'cwsn',
      label: 'CWSN IEP & Accommodations',
      icon: HeartHandshake,
      badge: 'RPwD 2016',
    },
    {
      id: 'resource-room',
      label: 'Inclusive Resource Room',
      icon: Building,
      badge: 'RCI Stds',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Student Lifecycle, Inclusion & Pastoral Care Suite
            </h1>
            <Badge variant="default" className="text-[11px] font-semibold py-0.5">
              NEP 2020 Aligned
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Unified student hub: manage permanent SIS identities, CBSE 20-point Transfer Certificates (TC),
            inter-departmental No-Dues clearances, positive behavioral points &amp; merits, RPwD Act 2016 IEP plans, and
            multi-disciplinary resource room accommodations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-300 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            UDISE+ PEN &amp; Digilocker Ready
          </Badge>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Directory & Admissions */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {directoryContent || (
            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              <p className="text-sm font-medium">Please access the primary student directory at /portal/admin/students</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Transfer Certificate Desk */}
      {activeTab === 'tc' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>CBSE Statutory By-Laws (20-Point Certificate):</strong> UDISE+ PEN verification, public QR code audit, and registrar sign-off.
              </span>
            </div>
            <Badge className="bg-blue-600 text-white text-[10px]">Verified Portal</Badge>
          </div>
          <TcRegistryManager viewMode="admin" />
        </div>
      )}

      {/* Tab 3: No-Dues Clearance Matrix */}
      {activeTab === 'clearance' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Cross-Departmental Clearance Protocol:</strong> Library, Accounts/Fees, Science Labs, Sports Equipment, and Hostel reconciliations.
              </span>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">Auto-Clearance</Badge>
          </div>
          <NoDuesManager />
        </div>
      )}

      {/* Tab 4: Pastoral Care & Merits */}
      {activeTab === 'discipline' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>House Championship &amp; Merits Leaderboard:</strong> Positive behavioural reinforcement, restorative counseling, and inter-house cups.
              </span>
            </div>
            <Badge className="bg-amber-600 text-white text-[10px]">NEP 2020 Rubrics</Badge>
          </div>
          <DisciplineManager />
        </div>
      )}

      {/* Tab 5: CWSN IEP & Accommodations */}
      {activeTab === 'cwsn' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-xs text-teal-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                <strong>RPwD Act 2016 &amp; CBSE Appendix IX Compliance:</strong> Individualized Education Plans (IEP), scribe allocation, and exam time concessions.
              </span>
            </div>
            <Badge className="bg-teal-600 text-white text-[10px]">RPwD 2016 Compliant</Badge>
          </div>
          <CwsnIepManager />
        </div>
      )}

      {/* Tab 6: Inclusive Multi-Disciplinary Resource Room */}
      {activeTab === 'resource-room' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-xs text-purple-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Rehabilitation Council of India (RCI) Standards:</strong> Multi-disciplinary clinical equipment, sensory therapy rooms, and assistive technology.
              </span>
            </div>
            <Badge className="bg-purple-600 text-white text-[10px]">RCI Clinical Standards</Badge>
          </div>
          <InclusiveResourceRoomManager role="admin" />
        </div>
      )}
    </div>
  );
}
