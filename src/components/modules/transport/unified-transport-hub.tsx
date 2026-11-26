'use client';

import React, { useState } from 'react';
import { Bus, MapPin, Wrench, Gauge, Radio, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { GpsFleetTracker } from '@/components/modules/transport/gps-tracker';
import { BusRoutesManager } from '@/components/modules/transport/bus-routes-manager';
import { FleetMaintenanceManager } from '@/components/modules/transport/fleet-maintenance-manager';
import { TransportTripsManager } from '@/components/modules/transport/transport-trips-manager';

interface UnifiedTransportHubProps {
  initialTab?: 'telematics' | 'routes' | 'maintenance' | 'trips';
}

export function UnifiedTransportHub({ initialTab = 'telematics' }: UnifiedTransportHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs: SubTabItem[] = [
    { id: 'telematics', label: 'Live GPS Telematics', icon: Radio, badge: 'AIS-140' },
    { id: 'routes', label: 'Routes & Bus Stops', icon: MapPin },
    { id: 'maintenance', label: 'Fleet Maintenance & Fitness', icon: Wrench },
    { id: 'trips', label: 'Trip Sheets & Fuel Logs', icon: Gauge },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="h-5 w-5 text-amber-600" />
            Unified Smart Transport Operations Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AIS-140 GPS telematics, Supreme Court safety compliance, bus route manifests, vehicle fitness renewals, and statutory fuel trip sheets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            Supreme Court Guidelines
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
            Speed Governed &le; 40 km/h
          </Badge>
        </div>
      </div>

      {/* Modern SubTabBar Navigation */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
        variant="pills"
      />

      {/* Tab Panels */}
      {activeTab === 'telematics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
              Live AIS-140 Satellite Telemetry & Real-Time Speed Tracking
            </h2>
          </div>
          <GpsFleetTracker />
        </div>
      )}

      {activeTab === 'routes' && <BusRoutesManager />}

      {activeTab === 'maintenance' && <FleetMaintenanceManager />}

      {activeTab === 'trips' && <TransportTripsManager />}
    </div>
  );
}
