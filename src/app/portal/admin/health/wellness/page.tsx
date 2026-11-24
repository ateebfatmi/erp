import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WellnessManager } from '@/components/modules/health/wellness-manager';

export default function AdminWellnessPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-pink-600" />
            CBSE School Health & Wellness Programme (SHWP) & Adolescent Peer Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ayushman Bharat statutory framework: 11 thematic modules, Health & Wellness Ambassadors (HWAs), Adolescent Peer Educators, and confidential mental health query box.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-pink-100 text-pink-800 border-pink-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ayushman Bharat Star Rated
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <WellnessManager role="admin" />
    </div>
  );
}
