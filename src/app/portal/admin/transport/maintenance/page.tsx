import React from 'react';
import { Bus, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FleetMaintenanceManager } from '@/components/modules/transport/fleet-maintenance-manager';

export default function FleetMaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="h-5 w-5 text-blue-600" />
            Supreme Court Norms, RTO Audits & Fleet Maintenance Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statutory compliance monitoring (Fitness Certificates, PUC, Insurance, Speed Governor ≤ 40 km/h, CCTV feeds) and fuel mileage telematics (km/L).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Supreme Court Order Compliant
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <FleetMaintenanceManager />
    </div>
  );
}
