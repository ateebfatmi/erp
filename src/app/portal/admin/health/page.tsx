import React from 'react';
import Link from 'next/link';
import { HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfirmaryManager } from '@/components/modules/health/infirmary-manager';

export default function AdminHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-600" />
            Campus Infirmary & Medical Health Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinical vitals, annual health cards, triage tracking, and medical clearance certificates.
          </p>
        </div>
        <Link href="/portal/admin/health/wellness">
          <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5 border-pink-200 text-pink-700 hover:bg-pink-50">
            <Sparkles className="h-3.5 w-3.5" />
            Ayushman Bharat SHWP & Peer Desk
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <InfirmaryManager />
    </div>
  );
}
