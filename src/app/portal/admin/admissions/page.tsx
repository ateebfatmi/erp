import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Scale, ArrowRight } from 'lucide-react';
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
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/portal/admin/admissions/rte"
            className="px-3 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>RTE 25% EWS Quota Desk</span>
            <ArrowRight className="w-3 h-3 text-teal-600" />
          </Link>
          <Badge variant="success">Session 2026-2027 Open</Badge>
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
