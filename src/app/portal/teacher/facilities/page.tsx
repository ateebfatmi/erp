import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResourceBookingManager } from '@/components/modules/facilities/resource-booking-manager';

export default function TeacherFacilitiesBookingPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Campus Labs & Shared Facilities Booking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reserve Atal Tinkering Lab, Computer Science Lab, AV Auditorium, and Sports Arenas with instant period-wise anti-collision verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Zero-Collision Engine
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <ResourceBookingManager role="teacher" />
    </div>
  );
}
