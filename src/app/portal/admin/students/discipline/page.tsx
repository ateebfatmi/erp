import React from 'react';
import { Trophy, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DisciplineManager } from '@/components/modules/students/discipline-manager';

export default function AdminDisciplinePage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Pastoral Care, Positive Merits & House Championship Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Cock House points leaderboard, positive behavioral reinforcement records, restorative counseling logs, and automated parent alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            NEP 2020 Holistic Rubrics
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <DisciplineManager />
    </div>
  );
}
