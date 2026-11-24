import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeacherPayrollManager } from '@/components/modules/payroll/teacher-payroll-manager';

export default function TeacherPayrollPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Faculty Payslips, EPF & Tax Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access monthly stamped salary statements, track EPFO Provident Fund & TDS withholdings, and submit annual Section 80C/80D tax declarations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            7th CPC Compliant
          </Badge>
        </div>
      </div>

      {/* Main Interactive Suite */}
      <TeacherPayrollManager />
    </div>
  );
}
