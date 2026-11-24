import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bus, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function TransportPage() {
  const auth = await getVerifiedAuthContext();
  const routes = await repository.getTransportRoutes(auth.tenantId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="h-5 w-5 text-amber-600" />
            Transport & Bus Fleet Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            GPS vehicle tracking readiness, route stops, driver contact directory, and transport fee allocation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">All Fleet Vehicles Active</Badge>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <Card key={route.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{route.route_name}</span>
              <Badge variant="default" className="font-mono">{route.vehicle_number}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Assigned Driver</span>
                <span className="font-semibold text-slate-800">{route.driver_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Emergency Phone</span>
                <span className="font-semibold text-slate-800">{route.driver_phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">
                Seating Capacity: <span className="font-bold text-slate-800">{route.capacity} seats</span>
              </span>
              <span className="font-bold text-blue-600">
                {formatCurrency(route.monthly_fee)} / mo
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
