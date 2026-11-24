import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlumniManager } from '@/components/modules/students/alumni-manager';

export default function AdminAlumniPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Alumni Relations & Official Transcript Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global graduate network directory, alumni career tracking, student mentorship linkages, and statutory transcript / WES apostille verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            WES & Apostille Ready
          </Badge>
        </div>
      </div>

      {/* Main Interactive Alumni Suite */}
      <AlumniManager />
    </div>
  );
}
