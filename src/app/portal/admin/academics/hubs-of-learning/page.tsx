import React from 'react';
import { Network, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HubsOfLearningManager } from '@/components/modules/academics/hubs-of-learning-manager';

export default function AdminHubsOfLearningPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" />
            CBSE Hubs of Learning (HoL) Collaborative Cluster Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lead Collaborator School (LCS) governance for CBSE Cluster #42: facility & lab sharing, joint Pre-Board exam paper moderation, peer teaching observation, and quarterly meetings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            CBSE Lead Collaborator School (LCS)
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <HubsOfLearningManager />
    </div>
  );
}
