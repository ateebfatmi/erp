import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';
import { AdmissionsPipelineBoard } from '@/components/modules/admissions/pipeline-board';

export default function AdmissionsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Admissions Desk & Lead Conversion Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, entrance assessment scores, document verifications, provisional offer letters, and enrollment conversions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Academic Session 2026-2027 Admissions Open</Badge>
          <Badge variant="outline">CBSE Quota Monitored</Badge>
        </div>
      </div>

      {/* Interactive Pipeline Board */}
      <div>
        <AdmissionsPipelineBoard />
      </div>
    </div>
  );
}
