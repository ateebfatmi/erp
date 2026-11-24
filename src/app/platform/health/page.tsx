import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, ShieldCheck, Database, HardDrive, Cpu } from 'lucide-react';

export default function PlatformHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Infrastructure Telemetry & Cluster Health
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realtime metrics across PostgreSQL read replicas, Supabase Storage buckets, and Clerk IAM.
          </p>
        </div>
        <Badge variant="success">All Systems Operational</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" /> Supabase PostgreSQL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4.2 ms</div>
            <p className="text-[11px] text-emerald-600 mt-1">Average Query Latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" /> Edge Serverless Compute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">99.99%</div>
            <p className="text-[11px] text-slate-500 mt-1">Zero 5xx Server Errors (24h)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-600" /> S3 Encrypted Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">128.4 GB</div>
            <p className="text-[11px] text-slate-500 mt-1">Private Document Buckets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
