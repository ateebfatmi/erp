import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

const REPORTS = [
  {
    title: 'Daily Fee Collection & Cash Reconciliation',
    domain: 'Finance & Accounts',
    formats: ['CSV', 'Excel', 'PDF'],
    description: 'Detailed audit ledger of online Razorpay, UPI, and cash counter receipts with bank UTRs.',
  },
  {
    title: 'CBSE OASIS & U-DISE+ Student Enrollment Census',
    domain: 'Academic Compliance',
    formats: ['Excel', 'CSV'],
    description: 'Standard demographic census format ready for direct statutory upload to government portals.',
  },
  {
    title: 'Monthly Section Attendance Summary & Shortage Warnings',
    domain: 'Attendance',
    formats: ['PDF', 'Excel'],
    description: 'Class-wise student attendance percentages highlighting students falling below CBSE 75% threshold.',
  },
  {
    title: 'Faculty Payroll Summary & Statutory Deductions',
    domain: 'Human Resources',
    formats: ['PDF', 'Excel'],
    description: 'EPF, ESI, TDS, and Professional Tax breakdown for all certified teaching and administrative staff.',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            Statutory Reports & Analytics Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate one-click CBSE compliance data, financial audits, U-DISE+ census, and printable PDFs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((rep, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[11px] font-semibold text-blue-700 bg-blue-50">
                {rep.domain}
              </Badge>
              <div className="flex items-center gap-1.5">
                {rep.formats.map((fmt) => (
                  <span key={fmt} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="font-bold text-sm text-slate-900">{rep.title}</div>
            <p className="text-xs text-slate-500 leading-relaxed">{rep.description}</p>

            <div className="pt-2 flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 text-blue-600">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Download Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-xs gap-1.5 text-slate-700">
                <FileText className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
