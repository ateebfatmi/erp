import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StudentHealthManager } from '@/components/modules/health/student-health-manager';

export default function StudentHealthPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-600" />
            My Health & Wellness Card
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your CBSE Health and Physical Activity Card, check infirmary treatment history, and review health metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Annual Health Certified
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <StudentHealthManager role="student" />
    </div>
  );
}
