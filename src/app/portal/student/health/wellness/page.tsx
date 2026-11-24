import React from 'react';
import { HeartPulse, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WellnessManager } from '@/components/modules/health/wellness-manager';

export default function StudentWellnessPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-pink-600" />
            Adolescent Wellness & Confidential Question Box
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with your class Peer Educators, explore life skills modules, and ask confidential questions anonymously to the School Counselor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            100% Confidential
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <WellnessManager role="student" />
    </div>
  );
}
